<?php

namespace App\Services\Airports;

use Illuminate\Support\Facades\DB;

class FindAirportsByLatLon
{
    public function execute($lat, $lon, $distance)
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
