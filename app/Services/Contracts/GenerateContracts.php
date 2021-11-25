<?php

namespace App\Services\Contracts;

use App\Services\Airports\FindAirportsWithinDistance;
use Illuminate\Support\Facades\Log;

class GenerateContracts
{
    protected FindAirportsWithinDistance $findAirportsWithinDistance;
    protected GenerateContractDetails $generateContractDetails;

    public function __construct(
        FindAirportsWithinDistance $findAirportsWithinDistance,
        GenerateContractDetails $generateContractDetails
    )
    {
        $this->findAirportsWithinDistance = $findAirportsWithinDistance;
        $this->generateContractDetails = $generateContractDetails;
    }

    public function execute($airport, $number)
    {
        try {
            // divide number by 3 (n)
            $qtyPerRange = round($number / 3);

            // get airports within 50nm
            $airports50 = $this->findAirportsWithinDistance->execute($airport, 50);
            // get airports within > 50 <= 150nm
            $airports150 = $this->findAirportsWithinDistance->execute($airport, 150);
            // get airports within > 150nm
            $airportsMax = $this->findAirportsWithinDistance->execute($airport, 500);

            // pick (n) random airports in each category
            if ($airports50->count() <= $qtyPerRange && $airports50->count() > 0) {
                $this->generateContractDetails->execute($airport, $airports50);
            } elseif ($airports50->count() > 0) {
                $this->generateContractDetails->execute($airport, $airports50->random($qtyPerRange));
            }

            if ($airports150->count() <= $qtyPerRange && $airports150->count() > 0) {
                $this->generateContractDetails->execute($airport, $airports150);
            } elseif ($airports150->count() > 0) {
                $this->generateContractDetails->execute($airport, $airports150->random($qtyPerRange));
            }

            if ($airportsMax->count() <= $qtyPerRange && $airportsMax->count() > 0) {
                $this->generateContractDetails->execute($airport, $airportsMax);
            } elseif ($airportsMax->count() > 0) {
                $this->generateContractDetails->execute($airport, $airportsMax->random($qtyPerRange));
            }
        }
        catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract base generation']);
        }
    }
}
