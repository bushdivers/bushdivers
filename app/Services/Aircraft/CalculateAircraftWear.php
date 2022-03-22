<?php

namespace App\Services\Aircraft;

class CalculateAircraftWear
{
    public function execute($aircraft)
    {
        if ($aircraft->flight_time_mins > 120000) {
            $ageMultiplier = 2.5;
        } else {
            $ageMultiplier = 1.1;
        }

        $wearMultiplier = 1;
        if ($aircraft->wear < 75 && $aircraft->wear >= 60) {
            $wearMultiplier = 1.2;
        } elseif ($aircraft->wear < 60 && $aircraft->wear >= 30) {
            $wearMultiplier = 2.0;
        } elseif ($aircraft->wear < 30) {
            $wearMultiplier = 3.0;
        }

        $ageWear = 2 * $ageMultiplier;
        $wear = 2 * $wearMultiplier;
        return round(($ageWear + $wear) / 2);
    }
}
