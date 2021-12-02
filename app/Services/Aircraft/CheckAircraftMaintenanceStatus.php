<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class CheckAircraftMaintenanceStatus
{
    public function execute($aircraftId): bool
    {
        $aircraft = Aircraft::with('fleet', 'engines')->find($aircraftId);
        $status = false;
        // check 100 hr
        if ($aircraft->mins_since_100hr >= (100 * 60)) {
            $status = true;
        }
        // check tbo
        foreach ($aircraft->engines as $engine) {
            if ($engine->mins_since_tbo >= $aircraft->fleet->tbo_mins) {
                $status = true;
            }
        }

        return $status;
    }
}
