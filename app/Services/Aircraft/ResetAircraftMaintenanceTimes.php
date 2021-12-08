<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\MaintenanceTypes;

class ResetAircraftMaintenanceTimes
{
    public function execute($aircraftId, $type, $engineId = null)
    {
        switch ($type) {
            case MaintenanceTypes::Maintenance100hr:
                $aircraft = Aircraft::find($aircraftId);
                $aircraft->mins_since_100hr = 0;
                $aircraft>save();
                break;
            case MaintenanceTypes::MaintenanceTBO:
                $engine = AircraftEngine::find($engineId);
                $engine->mins_since_tbo = 0;
                $engine->save();
                break;
        }
    }
}
