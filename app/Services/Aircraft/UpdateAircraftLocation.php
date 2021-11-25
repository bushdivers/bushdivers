<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class UpdateAircraftLocation
{
    public function execute(int $aircraft, string $icao, $lat = null, $lon = null)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->current_airport_id = $icao;
        if ($lon != null && $lat != null) {
            $aircraft->last_lat = $lat;
            $aircraft->last_lon = $lon;
        }
        $aircraft->save();
    }
}
