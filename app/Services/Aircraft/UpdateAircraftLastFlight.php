<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class UpdateAircraftLastFlight
{
    public function execute(int $aircraft, $flightDate)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->last_flight = $flightDate;
        $aircraft->save();
    }
}
