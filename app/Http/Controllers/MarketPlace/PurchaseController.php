<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Http\Requests\PurchaseAircraftRequest;
use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Services\Aircraft\CreateAircraft;
use App\Services\Aircraft\GenerateAircraft;
use App\Services\Finance\AddUserTransaction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    protected CreateAircraft $createAircraft;
    protected AddUserTransaction $addUserTransaction;
    protected GenerateAircraft $generateAircraft;

    public function __construct(AddUserTransaction $addUserTransaction, CreateAircraft $createAircraft, GenerateAircraft $generateAircraft)
    {
        $this->addUserTransaction = $addUserTransaction;
        $this->createAircraft = $createAircraft;
        $this->generateAircraft = $generateAircraft;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return RedirectResponse
     */
    public function __invoke(Request $request)
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
        if ($request->total > Auth::user()->balance) {
            return redirect()->back()->with(['error' => 'Insufficient funds']);
        }
        $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::AircraftPurchase, -$request->total);

        if ($request->purchaseType == 'new') {
            $aircraft = $this->createAircraft->execute($request->all(), Auth::user()->id);
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
            $aircraft->hub_id = $request->hub;
            $aircraft->registration = $request->reg;
            $aircraft->save();

            $this->generateAircraft->generateSpecific($aircraft->fleet_id, $aircraft->current_airport_id);
        }
        return redirect()->to('/aircraft/'.$aircraft->id)->with(['success' => 'Aircraft purchased']);
    }
}
