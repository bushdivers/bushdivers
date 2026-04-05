<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Pirep;

class UpdateAircraftAfterFlight
{
    public function execute(Aircraft $aircraft, Pirep $pirep)
    {
        $aircraft->state = AircraftState::AVAILABLE;
        $aircraft->user_id = null;

        $aircraft->fuel_onboard -= $pirep->fuel_used;

        if ($aircraft->fuel_onboard <= 0) {
            $aircraft->fuel_onboard = 0;
        }

        $aircraft->flight_time_mins += $pirep->flight_time;
        $aircraft->last_flight = $pirep->submitted_at;

        $aircraft->current_airport_id = $pirep->arrAirport->id;
        if ($pirep->current_lon != null && $pirep->current_lat != null) {
            $aircraft->last_lat = $pirep->current_lat;
            $aircraft->last_lon = $pirep->current_lon;
        }

        $aircraft->save();
    }
}
