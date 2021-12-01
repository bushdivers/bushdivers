<?php

namespace App\Services\Airports;

use App\Models\Enums\DistanceConsts;
use Illuminate\Support\Facades\DB;

class FindAirportsByLatLon
{
    public function execute($lat, $lon, $distance)
    {
        $maxLat = $lat + rad2deg($distance / DistanceConsts::EarthRadius);
        $minLat = $lat - rad2deg($distance / DistanceConsts::EarthRadius);
        $maxLon = $lon + rad2deg(asin($distance / DistanceConsts::EarthRadius) / cos(deg2rad($lat)));
        $minLon = $lon - rad2deg(asin($distance / DistanceConsts::EarthRadius) / cos(deg2rad($lat)));

        $results = DB::table('airports')
            ->select('identifier', 'lat', 'lon')
            ->whereIn('country', ['PG', 'ID'])
            ->whereBetween('lat', [$minLat, $maxLat])
            ->whereBetween('lon', [$minLon, $maxLon])
            ->first();

        return $results;
    }
}
