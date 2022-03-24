<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Services\Finance\AddUserTransaction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchaseNewController extends Controller
{
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AddUserTransaction $addUserTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return RedirectResponse
     */
    public function __invoke(Request $request)
    {
        // check balance & process funds
        if ($request->total > Auth::user()->balance) {
            return redirect()->back()->with(['error' => 'Insufficient funds']);
        }

        $fleet = Fleet::find($request->fleetId);

        $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::AircraftPurchase, -$request->total);
        // create aircraft
        $aircraft = new Aircraft();
        $aircraft->fleet_id = $request->fleetId;
        $aircraft->current_airport_id = $request->deliveryIcao;
        $aircraft->registration = $request->reg;
        $aircraft->state = 1;
        $aircraft->status = 1;
        $aircraft->hub_id = $request->hub;
        $aircraft->last_inspected_at = Carbon::now();
        $aircraft->owner_id = Auth::user()->id;
        $aircraft->save();

        $numEngines = $fleet->number_of_engines;

        for ($i = 0; $i < $numEngines; $i++) {
            $engine = new AircraftEngine();
            $engine->aircraft_id = $aircraft->id;
            $engine->engine_no = $i + 1;
            $engine->save();
        }

        return redirect()->to('/aircraft/'.$aircraft->id);
    }
}
