<?php

namespace App\Services\Aircraft;

class CalculateAircraftWear
{
    public function execute($aircraft)
    {
        if ($aircraft->flight_time_mins > 120000) {
            $ageMultiplier = 1.2;
        } else {
            $ageMultiplier = 0.2;
        }

        $wearMultiplier = 0.5;
        if ($aircraft->wear < 75 && $aircraft->wear >= 60) {
            $wearMultiplier = 0.8;
        } elseif ($aircraft->wear < 60 && $aircraft->wear >= 30) {
            $wearMultiplier = 1.4;
        } elseif ($aircraft->wear < 30) {
            $wearMultiplier = 2.0;
        }

        $ageWear = $ageMultiplier;
        $wear = $wearMultiplier;
        return round($ageWear + $wear, 2);
    }
}
