<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class UpdateAircraftFuel
{
    public function execute(int $aircraft, float $fuelQty)
    {
        $aircraft = Aircraft::find($aircraft);
        if ($aircraft->fuel_onboard == 0) {
            $aircraft->fuel_onboard = 0;
        } else {
            $aircraft->fuel_onboard -= $fuelQty;
        }

        $aircraft->save();
    }
}
