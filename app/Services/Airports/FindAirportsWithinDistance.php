<?php

namespace App\Services\Airports;

use App\Models\Airport;
use Illuminate\Support\Collection;

class FindAirportsWithinDistance
{
    public function execute(Airport $originAirport, int $minDistance, int $maxDistance, $toHub = false, $fuel = false, $limit = null): Collection
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
