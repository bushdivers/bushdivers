<?php

namespace App\Services\Airports;

use App\Models\Airport;
use Illuminate\Support\Collection;

class FindAirportsWithinDistance
{
    /**
     * Find airports within a given distance of the origin airport
     * @param Airport $originAirport
     * @param mixed $minDistance in nautical miles
     * @param mixed $maxDistance in nautical miles
     */
    public function execute(Airport $originAirport, $minDistance, $maxDistance, $toHub = false, $fuel = false, $limit = null): Collection
    {
        $q = Airport::inRangeOf($originAirport, $minDistance, $maxDistance);
        if ($toHub)
            $q->hub();
        if ($fuel)
            $q->fuel();
        if ($limit)
            $q->limit($limit);

        $q->orderBy('distance', 'asc');
        return $q->get();
    }
}
