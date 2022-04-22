<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\Enums\ContractConsts;
use App\Services\Airports\CalcDistanceBetweenPoints;
use App\Services\Airports\FindAirportsWithinDistance;
use App\Services\Geo\CreatePolygon;
use App\Services\Geo\IsPointInPolygon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateContracts
{
    protected GenerateContractDetails $generateContractDetails;

    public function __construct(GenerateContractDetails $generateContractDetails)
    {
        $this->generateContractDetails = $generateContractDetails;
    }

    public function execute($airport, $numberToGenerate, $flightLength, $aircraftSize)
    {
        try {
            switch ($flightLength) {
                case 'short':
                    $minLength = 1;
                    $maxLength = 60;
                    break;
                case 'medium':
                    $minLength = 61;
                    $maxLength = 200;
                    break;
                case 'long':
                    $minLength = 201;
                    $maxLength = 600;
                    break;
            }
            // get airports
            //$airports = Airport::all();
            $airports = DB::select(DB::raw(
                "SELECT *
                        FROM (
                          SELECT
                            airports.*,
                            3956 * ACOS(COS(RADIANS($airport->lat)) * COS(RADIANS(lat)) * COS(RADIANS($airport->lon) - RADIANS(lon)) + SIN(RADIANS($airport->lat)) * SIN(RADIANS(lat))) AS `distance`
                          FROM airports
                          WHERE
                            lat
                              BETWEEN $airport->lat - (300 / 69)
                              AND $airport->lat + (300 / 69)
                            AND lon
                              BETWEEN $airport->lon - (300 / (69 * COS(RADIANS($airport->lat))))
                              AND $airport->lon + (300 / (69* COS(RADIANS($airport->lat))))
                        ) r
                        WHERE distance BETWEEN $minLength AND $maxLength
                        ORDER BY distance ASC"
            ));

            // pick (n) random airports in each category
            $allAirports = collect($airports);
            if ($allAirports->count() <= $numberToGenerate && $allAirports->count() > 0) {
                return $this->generateContractDetails->execute($airport, $allAirports, $aircraftSize);
            } elseif (count($allAirports) > 0) {
                return $this->generateContractDetails->execute($airport, $allAirports->random($numberToGenerate), $aircraftSize);
            }
        }
        catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract base generation']);
        }
    }
}
