<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\MaintenanceTypes;
use Carbon\Carbon;

class UpdateAircraftCondition
{
    public function execute($aircraftId, $type, $wear, $engineId = null)
    {
        switch ($type) {
            case MaintenanceTypes::GeneralMaintenance:
                $engine = Aircraft::find($aircraftId);
                $engine->wear = $wear;
                $engine->save();
                break;
            case MaintenanceTypes::EngineMaintenance:
                $engine = AircraftEngine::find($engineId);
                $engine->wear = $wear;
                $engine->save();
                break;
        }
    }
}
