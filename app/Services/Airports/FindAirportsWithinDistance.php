<?php

namespace App\Services\Airports;

use App\Models\Enums\DistanceConsts;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FindAirportsWithinDistance
{
    public function execute($originAirport, int $minDistance, int $maxDistance, $toHub = false): Collection
    {
        if ($toHub) {
            $query = "WHERE distance BETWEEN ? AND ? AND is_hub = true";
        } else {
            $query = "WHERE distance BETWEEN ? AND ?";
        }
        $results = DB::select(
            "SELECT *
                        FROM (
                          SELECT
                            airports.*,
                            3956 * ACOS(COS(RADIANS($originAirport->lat)) * COS(RADIANS(lat)) * COS(RADIANS($originAirport->lon) - RADIANS(lon)) + SIN(RADIANS($originAirport->lat)) * SIN(RADIANS(lat))) AS `distance`
                          FROM airports
                        ) r
                        $query
                        ORDER BY distance ASC"
        , [$minDistance, $maxDistance]);
        return collect($results);
    }
}
