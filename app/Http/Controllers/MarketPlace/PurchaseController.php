<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\AccountLedger;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\TransactionTypes;
use App\Services\Aircraft\CreateAircraft;
use App\Services\Aircraft\GenerateAircraft;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{
    protected CreateAircraft $createAircraft;
    protected AddUserTransaction $addUserTransaction;
    protected AddAirlineTransaction $addAirlineTransaction;
    protected GenerateAircraft $generateAircraft;

    public function __construct(AddUserTransaction $addUserTransaction, CreateAircraft $createAircraft, GenerateAircraft $generateAircraft, AddAirlineTransaction $addAirlineTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
        $this->createAircraft = $createAircraft;
        $this->generateAircraft = $generateAircraft;
        $this->addAirlineTransaction = $addAirlineTransaction;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return RedirectResponse
     */
    public function __invoke(Request $request, $buyer)
    {
        if ($buyer === 'admin' && !Auth::user()->hasRole('fleet_admin')) {
            return redirect()->back()->with(['error' => 'You do not have permission to access this area']);
        }

        if ($request->purchaseType == 'new') {
            $request->validate([
                'purchaseType' => 'required',
                'hub' => 'required',
                'reg' => 'required|min:2|max:8',
                'deliveryIcao' => 'required',
            ]);
        } else {
            $request->validate([
                'purchaseType' => 'required',
                'hub' => 'required',
                'reg' => 'required|min:2|max:8',
                'id' => 'required|exists:aircraft,id',
            ]);
        }
        $hub = Airport::where('identifier', $request->hub)->first();
        if (!$hub) {
            return redirect()->back()->with(['error' => 'Airport specified as hub does not exist']);
        }
        // check balance & process funds
        if ($buyer === 'admin') {
            $balance = AccountLedger::all();
            if ($request->total > $balance->sum('total')) {
                return redirect()->back()->with(['error' => 'Insufficient funds']);
            }
        } else {
            if ($request->total > Auth::user()->balance) {
                return redirect()->back()->with(['error' => 'Insufficient funds']);
            }
        }

        if ($request->purchaseType == 'new') {
            $currentAirport = Airport::where('identifier', $request->deliveryIcao)->first();
            if (!$currentAirport) {
                return redirect()->back()->with(['error' => 'Delivery airport does not exist']);
            }
            $aircraft = $this->createAircraft->execute($request->all(), $buyer === 'admin' ? null : Auth::user(), $currentAirport);
        } else {
            $aircraft = Aircraft::with('location')->find($request->id);
            if ($request->reg != $aircraft->registration) {
                $aircraftCount = Aircraft::where('registration', $request->reg)
                    ->count();
                if ($aircraftCount > 0) {
                    return redirect()->back()->with(['error' => 'Aircraft registration already exists']);
                }
            }

            $aircraft->last_lat = $aircraft->location->lat;
            $aircraft->last_lon = $aircraft->location->lon;

            $aircraft->owner_id = $buyer === 'admin' ? 0 : Auth::user()->id;
            $aircraft->hub_id = $hub->id;
            $aircraft->registration = $request->reg;
            $aircraft->save();
        }
        if ($buyer === 'admin') {
            $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, $request->total, 'Purchase of aircraft');
        } else {
            $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::AircraftPurchase, -$request->total);
        }
        return redirect()->to('/aircraft/'.$aircraft->id)->with(['success' => 'Aircraft purchased']);
    }
}
