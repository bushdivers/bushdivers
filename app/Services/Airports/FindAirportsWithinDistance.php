<?php

namespace App\Services\Airports;

use App\Models\Enums\DistanceConsts;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FindAirportsWithinDistance
{
    public function execute($originAirport, int $minDistance, int $maxDistance): Collection
    {
        $results = DB::select(
            "SELECT *
                        FROM (
                          SELECT
                            airports.*,
                            3956 * ACOS(COS(RADIANS($originAirport->lat)) * COS(RADIANS(lat)) * COS(RADIANS($originAirport->lon) - RADIANS(lon)) + SIN(RADIANS($originAirport->lat)) * SIN(RADIANS(lat))) AS `distance`
                          FROM airports
                          WHERE
                            lat
                              BETWEEN $originAirport->lat - (300 / 69)
                              AND $originAirport->lat + (300 / 69)
                            AND lon
                              BETWEEN $originAirport->lon - (300 / (69 * COS(RADIANS($originAirport->lat))))
                              AND $originAirport->lon + (300 / (69* COS(RADIANS($originAirport->lat))))
                        ) r
                        WHERE distance BETWEEN ? AND ?
                        ORDER BY distance ASC"
        , [$minDistance, $maxDistance]);
        return collect($results);
    }
}
