<?php

namespace App\Services\Airports;

use App\Models\Enums\DistanceConsts;
use Location\Coordinate;
use Location\Distance\Haversine;

class CalcDistanceBetweenPoints
{
    public function execute($latFrom, $lonFrom, $latTo, $lonTo, bool $startRad = false, bool $endRad = false): float
    {
        $dep = new Coordinate($latFrom, $lonFrom);
        $arr = new Coordinate($latTo, $lonTo);

        $distance = $dep->getDistance($arr, new Haversine());

        return round($distance/DistanceConsts::MetersToNauticalMiles,1);
    }
}
