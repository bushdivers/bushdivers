<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\MaintenanceTypes;
use Carbon\Carbon;

class ResetAircraftCondition
{
    public function execute($aircraftId, $type, $engineId = null)
    {
        switch ($type) {
            case MaintenanceTypes::GeneralMaintenance:
                $engine = Aircraft::find($aircraftId);
                $engine->wear = 100;
                $engine->save();
                break;
            case MaintenanceTypes::EngineMaintenance:
                $engine = AircraftEngine::find($engineId);
                $engine->wear = 100;
                $engine->save();
                break;
        }
    }
}
