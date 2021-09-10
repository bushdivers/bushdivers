<?php

namespace App\Services;

use App\Models\Airport;

class AirportService
{
    public function getCostOfJumpseat(string $from, string $to): array
    {
        $start = Airport::where('identifier', $from)->firstOrFail();
        $end = Airport::where('identifier', $to)->firstOrFail();

        $distance = $this->calculateDistanceBetweenPoints($start->lat, $start->lon, $end->lat, $end->lon);

        $cost = round($distance * 0.25,2);
        return ['cost' => $cost, 'distance' => $distance];
    }

    public function calculateDistanceBetweenPoints($latFrom, $lonFrom, $latTo, $lonTo): float
    {
        $earthRadius = 3440.1;
        // calc distance
        $latFrom = deg2rad($latFrom);
        $lonFrom = deg2rad($lonFrom);
        $latTo = deg2rad($latTo);
        $lonTo = deg2rad($lonTo);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
                cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return round($angle * $earthRadius, 1);
    }
}
