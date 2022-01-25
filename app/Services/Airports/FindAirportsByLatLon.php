<?php

namespace App\Services\Airports;

use App\Models\Airport;
use App\Models\Enums\DistanceConsts;
use App\Services\Geo\CreatePolygon;
use Illuminate\Support\Facades\DB;
use Location\Coordinate;
use Location\Distance\Haversine;
use Location\Polygon;

class FindAirportsByLatLon
{
    public function execute($lat, $lon, $distance)
    {
        $currentAirport = null;
        $polyCreator = new CreatePolygon();
        $p = $polyCreator->execute($lat, $lon, $distance);
        $polygon = new Polygon();
        $location = new Coordinate($lat, $lon);
        foreach ($p as $point) {
            $polygon->addPoint(new Coordinate($point[0], $point[1]));
        }
        $airports = Airport::all();
        foreach ($airports as $airport) {
            $airportCoordinate = new Coordinate($airport->lat, $airport->lon);
            if ($polygon->contains($airportCoordinate)) {
                $distance = $location->getDistance($airportCoordinate, new Haversine()) / 1852;
                if ($distance <= 3) {
                    $currentAirport = $airport;
                    break;
                }
            }
        }

        return $currentAirport;
    }

//
//
//        $maxLat = $lat + rad2deg($distance / DistanceConsts::EarthRadius);
//        $minLat = $lat - rad2deg($distance / DistanceConsts::EarthRadius);
//        $maxLon = $lon + rad2deg(asin($distance / DistanceConsts::EarthRadius) / cos(deg2rad($lat)));
//        $minLon = $lon - rad2deg(asin($distance / DistanceConsts::EarthRadius) / cos(deg2rad($lat)));
//
//        $results = DB::table('airports')
//            ->select('identifier', 'lat', 'lon')
//            ->whereIn('country', ['PG', 'ID'])
//            ->whereBetween('lat', [$minLat, $maxLat])
//            ->whereBetween('lon', [$minLon, $maxLon])
//            ->first();
//
//        return $results;
//    }
}
