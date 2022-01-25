<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\Enums\ContractConsts;
use App\Services\Airports\CalcDistanceBetweenPoints;
use App\Services\Airports\FindAirportsWithinDistance;
use App\Services\Geo\CreatePolygon;
use App\Services\Geo\IsPointInPolygon;
use Illuminate\Support\Facades\Log;

class GenerateContracts
{
    protected FindAirportsWithinDistance $findAirportsWithinDistance;
    protected GenerateContractDetails $generateContractDetails;
    protected CreatePolygon $createPolygon;
    protected IsPointInPolygon $isPointInPolygon;
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;

    public function __construct(
        FindAirportsWithinDistance $findAirportsWithinDistance,
        GenerateContractDetails $generateContractDetails,
        CreatePolygon $createPolygon,
        IsPointInPolygon $isPointInPolygon,
        CalcDistanceBetweenPoints $calcDistanceBetweenPoints
    )
    {
        $this->findAirportsWithinDistance = $findAirportsWithinDistance;
        $this->generateContractDetails = $generateContractDetails;
        $this->createPolygon = $createPolygon;
        $this->isPointInPolygon = $isPointInPolygon;
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
    }

    public function execute($airport, $numberToGenerate)
    {
        try {
            // divide number by 3 (n)
//            $qtyPerRange = round($number / 3);

            $shortQty = ($numberToGenerate / 100) * ContractConsts::PERC_SHORT;
            $medQty = ($numberToGenerate / 100) * ContractConsts::PERC_MED;
            $longQty = ($numberToGenerate / 100) * ContractConsts::PERC_LONG;

            $polyShort = $this->createPolygon->execute($airport->lat, $airport->lon, 50);
            $polyMed = $this->createPolygon->execute($airport->lat, $airport->lon, 150);
            $polyLong = $this->createPolygon->execute($airport->lat, $airport->lon, 250);

            $shortAirports = [];
            $medAirports = [];
            $longAirports = [];

            // get airports
            $airports = Airport::all();

            foreach ($airports as $a) {
                $point = [$a->lat, $a->lon];
                if ($this->isPointInPolygon->execute($point, $polyShort)
                    && $this->calcDistanceBetweenPoints->execute($airport->lat, $airport->lon, $a->lat, $a->lon) <= 50) {
                    $shortAirports[] = $a;
                }

                if ($this->isPointInPolygon->execute($point, $polyMed)
                    && $this->calcDistanceBetweenPoints->execute($airport->lat, $airport->lon, $a->lat, $a->lon) > 50
                    && $this->calcDistanceBetweenPoints->execute($airport->lat, $airport->lon, $a->lat, $a->lon) <= 150) {
                    $medAirports[] = $a;
                }

                if ($this->isPointInPolygon->execute($point, $polyLong)
                    && $this->calcDistanceBetweenPoints->execute($airport->lat, $airport->lon, $a->lat, $a->lon) > 150) {
                    $longAirports[] = $a;
                }
            }


            // pick (n) random airports in each category
            $shortAirports = collect($shortAirports);
            if ($shortAirports->count() <= $shortQty && $shortAirports->count() > 0) {
                $this->generateContractDetails->execute($airport, $shortAirports);
            } elseif (count($shortAirports) > 0) {
                $this->generateContractDetails->execute($airport, $shortAirports->random($shortQty));
            }

            $medAirports = collect($medAirports);
            if ($medAirports->count() <= $medQty && $medAirports->count() > 0) {
                $this->generateContractDetails->execute($airport, $medAirports);
            } elseif ($medAirports->count() > 0) {
                $this->generateContractDetails->execute($airport, $medAirports->random($medQty));
            }

            $longAirports = collect($longAirports);
            if ($longAirports->count() <= $longQty && $longAirports->count() > 0) {
                $this->generateContractDetails->execute($airport, $longAirports);
            } elseif ($longAirports->count() > 0) {
                $this->generateContractDetails->execute($airport, $longAirports->random($longQty));
            }
        }
        catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract base generation']);
        }
    }
}
