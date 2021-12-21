<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use Carbon\Carbon;

class CheckAircraftMaintenanceStatus
{
    public function execute($aircraftId): array
    {
        $aircraft = Aircraft::with('fleet', 'engines')->find($aircraftId);
        $oneYearAgo = Carbon::now()->subYears(2);
        $status = ['tbo' => false, '100hr' => false, 'annual' => false];
        if ($aircraft->last_inspected_at && $aircraft->last_inspected_at->lessThan($oneYearAgo)) {
            $status['annual'] = true;
        }
        // check tbo and 100hr
        foreach ($aircraft->engines as $engine) {
            if ($engine->mins_since_tbo >= $aircraft->fleet->tbo_mins) {
                $status['tbo'] = true;
            }
            if ($engine->mins_since_100hr >= (100 * 60)) {
                $status['100hr'] = true;
            }
        }

        return $status;
    }
}
