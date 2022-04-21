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
        try {
            // divide number by 3 (n)

            $shortQty = ($numberToGenerate / 100) * ContractConsts::PERC_SHORT;
            $medQty = ($numberToGenerate / 100) * ContractConsts::PERC_MED;
            $longQty = ($numberToGenerate / 100) * ContractConsts::PERC_LONG;

            // get airports
            //$airports = Airport::all();
            $shortA = DB::select(DB::raw(
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
                        WHERE distance BETWEEN 1 AND 50
                        ORDER BY distance ASC"
            ));
            $medA = DB::select(DB::raw(
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
                        WHERE distance BETWEEN 51 AND 150
                        ORDER BY distance ASC"
            ));
            $longA = DB::select(DB::raw(
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
                        WHERE distance BETWEEN 151 AND 300
                        ORDER BY distance ASC"
            ));


            // pick (n) random airports in each category
            $shortAirports = collect($shortA);
            if ($shortAirports->count() <= $shortQty && $shortAirports->count() > 0) {
                $shortContracts = $this->generateContractDetails->execute($airport, $shortAirports);
            } elseif (count($shortAirports) > 0) {
                $shortContracts = $this->generateContractDetails->execute($airport, $shortAirports->random($shortQty));
            }

            $medAirports = collect($medA);
            if ($medAirports->count() <= $medQty && $medAirports->count() > 0) {
                $medContracts = $this->generateContractDetails->execute($airport, $medAirports);
            } elseif ($medAirports->count() > 0) {
                $medContracts = $this->generateContractDetails->execute($airport, $medAirports->random($medQty));
            }

            $longAirports = collect($longA);
            if ($longAirports->count() <= $longQty && $longAirports->count() > 0) {
                $longContracts = $this->generateContractDetails->execute($airport, $longAirports);
            } elseif ($longAirports->count() > 0) {
                $longContracts = $this->generateContractDetails->execute($airport, $longAirports->random($longQty));
            }

            $c = collect($shortContracts);
            $merged = $c->merge($medContracts);
            $merged = $merged->merge($longContracts);
            return $merged;
        }
        catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract base generation']);
        }
    }
}
