<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use Illuminate\Support\Facades\DB;

class UpdateAircraftMaintenanceTimes
{
    public function execute(Aircraft $aircraft, int $timeInMins)
    {
        $aircraft->engines()->incrementEach([
            'mins_since_tbo' => $timeInMins,
            'mins_since_100hr' => $timeInMins,
        ]);
    }
}
