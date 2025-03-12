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
    /**
     * Find the nearest airport to the given lat/lon
     * @param mixed $lat
     * @param mixed $lon
     * @param mixed $distance in nautical miles
     */
    public function execute($lat, $lon, $distance)
    {
        $location = new Coordinate($lat, $lon);
        return Airport::inRangeOf($location, 0, $distance)->orderBy('distance')->first();
    }

}
