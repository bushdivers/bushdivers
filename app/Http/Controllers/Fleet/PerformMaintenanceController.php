<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\AccountLedger;
use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\MaintenanceTypes;
use App\Models\Enums\TransactionTypes;
use App\Services\Aircraft\AddMaintenanceLog;
use App\Services\Aircraft\GetMaintenanceCost;
use App\Services\Aircraft\UpdateAircraftCondition;
use App\Services\Aircraft\ResetAircraftMaintenanceTimes;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PerformMaintenanceController extends Controller
{
    protected ResetAircraftMaintenanceTimes $resetAircraftMaintenanceTimes;
    protected UpdateAircraftCondition $updateAircraftCondition;
    protected AddMaintenanceLog $addMaintenanceLog;
    protected AddAirlineTransaction $addAirlineTransaction;
    protected AddUserTransaction $addUserTransaction;
    protected GetMaintenanceCost $getMaintenanceCost;

    public function __construct(
        ResetAircraftMaintenanceTimes $resetAircraftMaintenanceTimes,
        AddMaintenanceLog $addMaintenanceLog,
        AddAirlineTransaction $addAirlineTransaction,
        AddUserTransaction $addUserTransaction,
        GetMaintenanceCost $getMaintenanceCost,
        UpdateAircraftCondition $updateAircraftCondition
    )
    {
        $this->resetAircraftMaintenanceTimes = $resetAircraftMaintenanceTimes;
        $this->addMaintenanceLog = $addMaintenanceLog;
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->addUserTransaction = $addUserTransaction;
        $this->getMaintenanceCost = $getMaintenanceCost;
        $this->updateAircraftCondition = $updateAircraftCondition;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $engine = null;
        $aircraft = Aircraft::find($request->aircraft);
        if ($request->engine) {
            $engine = AircraftEngine::find($request->engine);
        }
        // get cost
        $cost = $this->getMaintenanceCost->execute($request->type, $aircraft->fleet->size);

        if ($request->type == 4) {
            if ($aircraft->wear < 70 && $aircraft->wear >= 45) {
                $cost = $cost * 1.75;
            }
            if ($aircraft->wear < 45) {
                $cost = $cost * 2.75;
            }
        }

        if ($request->type == 5) {
            if ($engine->wear < 70 && $engine->wear >= 45) {
                $cost = $cost * 1.75;
            }
            if ($engine->wear < 45) {
                $cost = $cost * 2.75;
            }
        }

        if ($aircraft->owner_id > 0) {
            $userBalance = $balance = DB::table('user_accounts')
                ->where('user_id', Auth::user()->id)
                ->sum('total');

            if ($cost > $userBalance) {
                return redirect()->back()->with(['error' => 'Insufficient funds to perform maintenance']);
            }
        }

        if ($aircraft->owner_id == 0) {
            $balance = AccountLedger::all()->sum('total');

            if ($cost > $balance) {
                return redirect()->back()->with(['error' => 'Insufficient funds to perform maintenance']);
            }
        }
        if ($request->type == 4 || $request->type == 5) {
            $this->updateAircraftCondition->execute($request->aircraft, $request->type, 100, $request->engine);
        } else {
            // process maintenance
            $this->resetAircraftMaintenanceTimes->execute($request->aircraft, $request->type, $request->engine);
        }

        // add maintenance log
        $this->addMaintenanceLog->execute($request->aircraft, $request->type, Auth::user()->id, $cost, $request->engine);
        // add transaction
        if ($aircraft->owner_id > 0) {
            $this->addUserTransaction->execute($aircraft->owner_id, TransactionTypes::AircraftMaintenanceFee, -$cost);
        } else {
            $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftMaintenanceFee, $cost, 'Maintenance: '.$aircraft->registration);
        }

        return redirect()->back()->with(['success' => 'Maintenance performed successfully']);
    }
}
