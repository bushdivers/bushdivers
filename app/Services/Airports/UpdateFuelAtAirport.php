<?php

namespace App\Services\Airports;

use App\Models\Airport;

class UpdateFuelAtAirport
{
    public function execute(Airport $airport, int $fuel, int $fuelType, string $action)
    {
        if ($airport->is_hub) return;
        if ($fuelType == 1) {
            $action == 'increment' ? $airport->avgas_qty += $fuel : $airport->avgas_qty -= $fuel;
        } else {
            $action == 'increment' ? $airport->jetfuel_qty += $fuel : $airport->jetfuel_qty -= $fuel;
        }
        $airport->save();
    }
}
