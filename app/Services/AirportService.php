<?php

namespace App\Services;

use App\Models\Airport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AirportService
{
    protected float $earthRadius = 3440.1; // nm

    public function getCostOfJumpseat(string $from, string $to): array
    {
        $start = Airport::where('identifier', $from)->firstOrFail();
        $end = Airport::where('identifier', $to)->firstOrFail();

        $distance = $this->calculateDistanceBetweenPoints($start->lat, $start->lon, $end->lat, $end->lon);

        $cost = round($distance * 0.25,2);
        return ['cost' => $cost, 'distance' => $distance];
    }

    public function calculateDistanceBetweenPoints($latFrom, $lonFrom, $latTo, $lonTo, bool $startRad = false, bool $endRad = false): float
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
        $d = $this->earthRadius * $c;

        return round($d,1);
    }

    public function calculateBearingBetweenPoints($latFrom, $lonFrom, $latTo, $lonTo, $destVariance): int
    {
//        $latFrom = deg2rad($latFrom);
//        $lonFrom = deg2rad($lonFrom);
//        $latTo = deg2rad($latTo);
//        $lonTo = deg2rad($lonTo);

        $bearingDeg = (rad2deg(atan2(sin(deg2rad($lonTo) - deg2rad($lonFrom)) *
                    cos(deg2rad($latTo)), cos(deg2rad($latFrom)) * sin(deg2rad($latTo)) -
                    sin(deg2rad($latFrom)) * cos(deg2rad($latTo)) * cos(deg2rad($lonTo) - deg2rad($lonFrom)))) + 360) % 360;

        $alteredBearing = $bearingDeg - $destVariance;

        return $alteredBearing < 0 ? $alteredBearing + 360 : $alteredBearing;
    }

    public function findAirportsWithinDistance($originAirport, $distance): Collection
    {
        $maxLat = $originAirport->lat + rad2deg($distance/$this->earthRadius);
        $minLat = $originAirport->lat - rad2deg($distance/$this->earthRadius);
        $maxLon = $originAirport->lon + rad2deg(asin($distance/$this->earthRadius) / cos(deg2rad($originAirport->lat)));
        $minLon = $originAirport->lon - rad2deg(asin($distance/$this->earthRadius) / cos(deg2rad($originAirport->lat)));

        $results = DB::table('airports')
            ->select('identifier', 'lat', 'lon', 'magnetic_variance')
            ->where('identifier', '<>', $originAirport->identifier)
            ->whereIn('country', ['PG', 'ID'])
            ->whereBetween('lat', [$minLat, $maxLat])
            ->whereBetween('lon', [$minLon, $maxLon])
            ->get();

        return $results;
    }

    public function findAirportsByLatLon($lat, $lon, $distance)
    {
        $maxLat = $lat + rad2deg($distance/$this->earthRadius);
        $minLat = $lat - rad2deg($distance/$this->earthRadius);
        $maxLon = $lon + rad2deg(asin($distance/$this->earthRadius) / cos(deg2rad($lat)));
        $minLon = $lon - rad2deg(asin($distance/$this->earthRadius) / cos(deg2rad($lat)));

        $results = DB::table('airports')
            ->select('identifier', 'lat', 'lon')
            ->whereIn('country', ['PG', 'ID'])
            ->whereBetween('lat', [$minLat, $maxLat])
            ->whereBetween('lon', [$minLon, $maxLon])
            ->first();

        return $results;
    }
}
