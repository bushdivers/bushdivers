<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\MaintenanceTypes;
use Carbon\Carbon;

class ResetAircraftMaintenanceTimes
{
    public function execute($aircraftId, $type, $engineId = null)
    {
        switch ($type) {
            case MaintenanceTypes::Maintenance100hr:
                $engine = AircraftEngine::find($engineId);
                $engine->mins_since_100hr = 0;
                $engine->save();
                break;
            case MaintenanceTypes::MaintenanceTBO:
                $engine = AircraftEngine::find($engineId);
                $engine->mins_since_tbo = 0;
                $engine->wear = 100;
                $engine->save();
                break;
            case MaintenanceTypes::Annual:
                $aircraft = Aircraft::find($aircraftId);
                $aircraft->last_inspected_at = Carbon::now();
                $aircraft->save();
                break;
        }
    }
}
