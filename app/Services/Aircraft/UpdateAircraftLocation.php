<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\Airport;

class UpdateAircraftLocation
{
    public function execute(int $aircraft, string|Airport $icao, $lat = null, $lon = null)
    {
        if ($icao instanceof Airport) {
            $icao = $icao->id;
        } else {
            $icao = Airport::whereIdentifier($icao)->first()->id;
        }

        $aircraft = Aircraft::find($aircraft);
        $aircraft->current_airport_id = $icao;
        if ($lon != null && $lat != null) {
            $aircraft->last_lat = $lat;
            $aircraft->last_lon = $lon;
        }
        $aircraft->save();
    }
}
