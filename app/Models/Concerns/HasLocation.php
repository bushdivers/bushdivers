<?php
namespace App\Models\Concerns;

use App\Contracts\IsLocatable;
use App\Models\Enums\DistanceConsts;
use Location\Coordinate;
use Location\Distance\Haversine;

trait HasLocation
{
    // Ensure getCoordinate exists (bonus, implements IsLocatable)
    abstract public function getCoordinate(): Coordinate;

    public function distanceTo(IsLocatable|Coordinate $destination): float
    {
        return self::distanceBetween($this, $destination);
    }

    static public function distanceBetween(IsLocatable|Coordinate $origin, IsLocatable|Coordinate $destination): float
    {
        $from = $origin instanceof Coordinate ? $origin : $origin->getCoordinate();
        $to = $destination instanceof Coordinate ? $destination : $destination->getCoordinate();

        $distance = $from->getDistance($to, new Haversine());

        return round($distance / DistanceConsts::MetersToNauticalMiles, 1);
    }
}