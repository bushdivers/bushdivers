<?php

namespace App\Services\Airports;

use App\Models\Airport;

class UpdateFuelAtAirport
{
    public function execute(string $airportIdentifier, int $fuel, int $fuelType, string $action)
    {
        $airport = Airport::where('identifier', $airportIdentifier)->first();
        if ($airport->is_hub) return;
        if ($fuelType == 1) {
            $action == 'increment' ? $airport->avgas_qty += $fuel : $airport->avgas_qty -= $fuel;
        } else {
            $action == 'increment' ? $airport->jetfuel_qty += $fuel : $airport->jetfuel_qty -= $fuel;
        }
        $airport->save();
    }
}
