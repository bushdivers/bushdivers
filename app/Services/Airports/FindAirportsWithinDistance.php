<?php

namespace App\Services\Airports;

use App\Models\Enums\DistanceConsts;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FindAirportsWithinDistance
{
    public function execute($originAirport, int $minDistance, int $maxDistance, $toHub = false, $fuel = false, $limit = null): Collection
    {
        $query = "WHERE distance BETWEEN ? AND ?";
        if ($toHub && !$fuel) {
            $query .= " AND is_hub = true";
        } else if ($fuel && !$toHub) {
            $query .= " AND (has_avgas = true OR has_jetfuel = true)";
        } else if ($fuel && $toHub) {
            $query .= " (has_avgas = true OR has_jetfuel = true) AND is_hub = true";
        }

        if ($limit) {
            $limit = " LIMIT $limit";
        } else {
            $limit = "";
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
                        ORDER BY distance ASC
                        $limit"
        , [$minDistance, $maxDistance]);
        return collect($results);
    }
}
