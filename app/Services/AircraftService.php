<?php

namespace App\Services;

use App\Models\Aircraft;
use App\Models\Flight;

class AircraftService
{
    public function findAircraftFromString(string $name): ?Aircraft
    {
        $array = explode(' ', $name);
        $reg = $array[count($array)-1];
        return Aircraft::where('registration', $reg)->first();
    }

    public function updateAircraftState(int $aircraft, $state)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->state = $state;
        $aircraft->save();
    }

    public function updateAircraftFuel(int $aircraft, float $fuelQty)
    {
        $aircraft = Aircraft::find($aircraft);
        if ($aircraft->fuel_onboard == 0) {
            $aircraft->fuel_onboard = 0;
        } else {
            $aircraft->fuel_onboard -= $fuelQty;
        }

        $aircraft->save();
    }

    public function updateAircraftHours(int $aircraft, $time)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->flight_time_mins += $time;
        $aircraft->save();
    }

    public function updateAircraftLocation(int $aircraft, string $icao)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->current_airport_id = $icao;
        $aircraft->save();
    }

    public function updateAircraftLastFlightDate(int $aircraft, $flightDate)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->last_flight = $flightDate;
        $aircraft->save();
    }
}
