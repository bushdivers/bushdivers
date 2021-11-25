<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class UpdateAircraftHours
{
    public function execute(int $aircraft, $time)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->flight_time_mins += $time;
        $aircraft->save();
    }
}
