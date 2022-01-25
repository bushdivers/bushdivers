<?php

namespace App\Services\Geo;

use App\Models\Enums\DistanceConsts;

class CreatePolygon
{
    protected float $lat;
    protected float $lon;
    protected int $distance;

//    public function __construct(float $lat, float $lon, int $distance)
//    {
//        $this->lat = $lat;
//        $this->lon = $lon;
//        $this->distance = $distance;
//    }

    public function execute(float $lat, float $lon, int $distance): array
    {
        $this->lat = $lat;
        $this->lon = $lon;
        $this->distance = $distance;

        $n = 16;
        $flatCoordinates = [];
        $coordinates = [];
        for ($i = 0; $i < $n; $i++) {
            $bearing = 2 * pi() * $i / $n;
            $flatCoordinates = array_merge($flatCoordinates, $this->offset($bearing));
        }

        $flatCoordinates[] = $flatCoordinates[0];
        $flatCoordinates[] = $flatCoordinates[1];

        for ($i = 0, $j = 0; $j < count($flatCoordinates); $j += 2) {
            $coordinates[$i++] = array_slice($flatCoordinates, $j, 2);
        }

        return $coordinates;
    }

    protected function offset($bearing): array
    {
        $lat1 = deg2rad($this->lat);
        $lon1 = deg2rad($this->lon);

        $dByR = $this->distance / DistanceConsts::EarthRadius;

        $lat = asin(
            sin($lat1) * cos($dByR) +
            cos($lat1) * sin($dByR) * cos($bearing)
        );
        $lon = $lon1 + atan2(
                sin($bearing) * sin($dByR) * cos($lat1),
                cos($dByR) - sin($lat1) * sin($lat)
        );

        return [rad2deg($lat), rad2deg($lon)];
    }
}
