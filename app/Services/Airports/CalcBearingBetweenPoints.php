<?php

namespace App\Services\Airports;

class CalcBearingBetweenPoints
{
    public function execute($latFrom, $lonFrom, $latTo, $lonTo, $destVariance): int
    {
        $bearingDeg = (rad2deg(atan2(sin(deg2rad($lonTo) - deg2rad($lonFrom)) *
                    cos(deg2rad($latTo)), cos(deg2rad($latFrom)) * sin(deg2rad($latTo)) -
                    sin(deg2rad($latFrom)) * cos(deg2rad($latTo)) * cos(deg2rad($lonTo) - deg2rad($lonFrom)))) + 360) % 360;

        $alteredBearing = $bearingDeg - $destVariance;

        return $alteredBearing < 0 ? $alteredBearing + 360 : $alteredBearing;
    }
}
