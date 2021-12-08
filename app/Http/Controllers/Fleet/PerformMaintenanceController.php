<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\MaintenanceTypes;
use App\Services\Aircraft\AddMaintenanceLog;
use App\Services\Aircraft\ResetAircraftMaintenanceTimes;
use App\Services\Finance\AddAirlineTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PerformMaintenanceController extends Controller
{
    protected ResetAircraftMaintenanceTimes $resetAircraftMaintenanceTimes;
    protected AddMaintenanceLog $addMaintenanceLog;
    protected AddAirlineTransaction $addAirlineTransaction;

    public function __construct(
        ResetAircraftMaintenanceTimes $resetAircraftMaintenanceTimes,
        AddMaintenanceLog $addMaintenanceLog,
        AddAirlineTransaction $addAirlineTransaction
    )
    {
        $this->resetAircraftMaintenanceTimes = $resetAircraftMaintenanceTimes;
        $this->addMaintenanceLog = $addMaintenanceLog;
        $this->addAirlineTransaction = $addAirlineTransaction;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $aircraft = Aircraft::find($request->aircraft);
        // process maintenance
        $this->resetAircraftMaintenanceTimes->execute($request->aircraft, $request->type, $request->engine);
        // add maintenance log
        $cost = $this->addMaintenanceLog->execute($request->aircraft, $aircraft->fleet->size, $request->type, Auth::user()->id, $request->engine);
        // add airline transaction if not a rental
        if (!$aircraft->is_rental) {
            $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftMaintenanceFee, $cost, 'Maintenance: '.$aircraft->registration);
        }

        return redirect()->back()->with(['success' => 'Maintenance performed successfully']);
    }
}
