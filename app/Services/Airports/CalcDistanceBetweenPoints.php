<?php

namespace App\Services\Airports;

use App\Models\Enums\DistanceConsts;

class CalcDistanceBetweenPoints
{
    public function execute($latFrom, $lonFrom, $latTo, $lonTo, bool $startRad = false, bool $endRad = false): float
    {
        if (!$startRad) {
            $latFrom = deg2rad($latFrom);
            $lonFrom = deg2rad($lonFrom);
        }

        if (!$endRad) {
            $latTo = deg2rad($latTo);
            $lonTo = deg2rad($lonTo);
        }

        $thetaLat = $latTo - $latFrom;
        $thetaLon = $lonTo - $lonFrom;

        $a = sin($thetaLat / 2) * sin($thetaLat / 2) + cos($latFrom) * cos($latTo) * sin($thetaLon / 2) * sin($thetaLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $d = DistanceConsts::EarthRadius * $c;

        return round($d,1);
    }
}
