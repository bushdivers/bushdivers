<?php

namespace App\Services\Airports;

use App\Models\Enums\DistanceConsts;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FindAirportsWithinDistance
{
    public function execute($originAirport, $distance): Collection
    {
        $maxLat = $originAirport->lat + rad2deg($distance / DistanceConsts::EarthRadius);
        $minLat = $originAirport->lat - rad2deg($distance / DistanceConsts::EarthRadius);
        $maxLon = $originAirport->lon + rad2deg(asin($distance / DistanceConsts::EarthRadius) / cos(deg2rad($originAirport->lat)));
        $minLon = $originAirport->lon - rad2deg(asin($distance / DistanceConsts::EarthRadius) / cos(deg2rad($originAirport->lat)));

        $results = DB::table('airports')
            ->select('identifier', 'lat', 'lon', 'magnetic_variance')
            ->where('identifier', '<>', $originAirport->identifier)
            ->whereIn('country', ['PG', 'ID'])
            ->whereBetween('lat', [$minLat, $maxLat])
            ->whereBetween('lon', [$minLon, $maxLon])
            ->get();

        return $results;
    }
}
