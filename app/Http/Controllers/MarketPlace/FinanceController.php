<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Http\Requests\FinanceAircraftRequest;
use App\Models\Aircraft;
use App\Models\Enums\TransactionTypes;
use App\Models\FinanceAgreement;
use App\Services\Aircraft\CreateAircraft;
use App\Services\Aircraft\GenerateAircraft;
use App\Services\Finance\AddUserTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FinanceController extends Controller
{
    protected CreateAircraft $createAircraft;
    protected AddUserTransaction $addUserTransaction;
    protected GenerateAircraft $generateAircraft;

    public function __construct(CreateAircraft $createAircraft, AddUserTransaction $addUserTransaction, GenerateAircraft $generateAircraft)
    {
        $this->createAircraft = $createAircraft;
        $this->addUserTransaction = $addUserTransaction;
        $this->generateAircraft = $generateAircraft;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        if ($request->purchaseType == 'new') {
            $request->validate([
                'purchaseType' => 'required',
                'hub' => 'required',
                'reg' => 'required|max:8|unique:aircraft,registration',
            ]);
        } else {
            $request->validate([
                'purchaseType' => 'required',
                'hub' => 'required'
            ]);
        }

        // check balance & process funds
        if ($request->deposit > Auth::user()->balance) {
            return redirect()->back()->with(['error' => 'Insufficient funds']);
        }

        if ($request->purchaseType == 'new') {
            //create aircraft and engine(s)
            $aircraft = $this->createAircraft->execute($request->all(), Auth::user()->id, true);
        } else {
            $aircraft = Aircraft::find($request->id);

            if ($request->reg != $aircraft->registration) {
                $aircraftCount = Aircraft::where('registration', $request->reg)
                    ->count();
                if ($aircraftCount > 0) {
                    return redirect()->back()->with(['error' => 'Aircraft registration already exists']);
                }
            }

            $aircraft->owner_id = Auth::user()->id;
            $aircraft->is_financed = true;
            $aircraft->hub_id = $request->hub;
            $aircraft->registration = $request->reg;
            $aircraft->save();

            $this->generateAircraft->generateSpecific($aircraft->fleet_id, $aircraft->current_airport_id);
        }

        //create credit record
        $agreement = new FinanceAgreement();
        $agreement->user_id = Auth::user()->id;
        $agreement->aircraft_id = $aircraft->id;
        $agreement->deposit = $request->deposit;
        $agreement->finance_amount = $request->financeAmount;
        $agreement->term_months = $request->term;
        $agreement->monthly_payments = $request->monthlyPayments;
        $agreement->amount_remaining = $request->financeAmount;
        $agreement->term_remaining = $request->term;
        $agreement->missed_payments = 0;
        $agreement->save();

        //create transaction
        if ($request->deposit > 0) $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::AircraftPurchase, -$request->deposit);

        return redirect()->to('/aircraft/'.$aircraft->id)->with(['success' => 'Aircraft financed']);
    }
}
