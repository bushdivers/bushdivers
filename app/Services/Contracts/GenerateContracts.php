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

    public function execute($airport, $numberToGenerate)
    {
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
                        WHERE distance BETWEEN 15 AND 150
                        ORDER BY distance ASC"
            ));

            // pick (n) random airports in each category
            $allAirports = collect($airports);

            if ($allAirports->count() === 0) {
                return null;
            }
            if ($allAirports->count() === 1) {
                $numberToGenerate = 4;
            }

            if ($allAirports->count() < $numberToGenerate && $allAirports->count() > 1) {
                $numberToGenerate = $numberToGenerate / 2;
            }

            $contracts = [];
            $i = 1;
            while ($i <= $numberToGenerate) {
                $destAirport = $allAirports->random(1);

                if ($airport->identifier != $destAirport[0]->identifier) {
                    $contract = $this->generateContractDetails->execute($airport, $destAirport[0]);
                    $contracts[] = $contract;
                }
                $i++;
            }
            return $contracts;

//            if ($allAirports->count() <= $numberToGenerate && $allAirports->count() > 0) {
//                return $this->generateContractDetails->execute($airport, $allAirports);
//            } elseif (count($allAirports) > 0) {
//                return $this->generateContractDetails->execute($airport, $allAirports->random($numberToGenerate));
//            }
    }
}
