<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;

class UpdateAircraftMaintenanceTimes
{
    public function execute($aircraftId, int $timeInMins)
    {
        $engines = AircraftEngine::where('aircraft_id', $aircraftId)->get();
        foreach ($engines as $engine) {
            $engine->mins_since_tbo += $timeInMins;
            $engine->mins_since_100hr += $timeInMins;
            $engine->save();
        }
    }
}
