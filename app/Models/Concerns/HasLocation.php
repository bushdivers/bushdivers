<?php
namespace App\Models\Concerns;

use App\Contracts\IsLocatable;
use App\Models\Enums\DistanceConsts;
use Location\Bearing\BearingSpherical;
use Location\Coordinate;
use Location\Distance\Haversine;

trait HasLocation
{
    // Ensure getCoordinate exists (bonus, implements IsLocatable)
    abstract public function getCoordinate(): Coordinate;

    /**
     * Retrieve distance from this point to a destination, in nautical miles
     * @param IsLocatable|Coordinate $destination
     * @return float Distance in nautical miles
     */
    public function distanceTo(IsLocatable|Coordinate $destination): float
    {
        return self::distanceBetween($this, $destination);
    }

    /**
     * Retrieve bearing from this point to a destination, in whole degrees
     * @param IsLocatable|Coordinate $destination
     * @return int Bearing in whole degrees
     */
    public function bearingTo(IsLocatable|Coordinate $destination): int
    {
        $from = $this->getCoordinate();
        $to = $destination instanceof Coordinate ? $destination : $destination->getCoordinate();

        $bearingCalc = new BearingSpherical();
        $bearing = $bearingCalc->calculateBearing($from, $to);

        /**if ($magneticVariance !== null) {
            $alteredBearing = $bearing - $magneticVariance;
            return $alteredBearing < 0 ? $alteredBearing + 360 : $alteredBearing;
        }*/

        return (int) round($bearing) % 360;
    }

    static public function distanceBetween(IsLocatable|Coordinate $origin, IsLocatable|Coordinate $destination): float
    {
        $from = $origin instanceof Coordinate ? $origin : $origin->getCoordinate();
        $to = $destination instanceof Coordinate ? $destination : $destination->getCoordinate();

        $distance = $from->getDistance($to, new Haversine());

        return round($distance / DistanceConsts::MetersToNauticalMiles, 1);
    }
}