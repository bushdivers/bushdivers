<?php

namespace App\Services\Contracts;

use App\Services\Airports\FindAirportsWithinDistance;

class GenerateContracts
{
    protected GenerateContractDetails $generateContractDetails;
    protected FindAirportsWithinDistance $findAirportsWithinDistance;

    public function __construct(GenerateContractDetails $generateContractDetails, FindAirportsWithinDistance $findAirportsWithinDistance)
    {
        $this->generateContractDetails = $generateContractDetails;
        $this->findAirportsWithinDistance = $findAirportsWithinDistance;
    }

    public function execute($airport, $numberToGenerate, $toHub = false)
    {
        // get airports
        $nearbyAirports = $this->findAirportsWithinDistance->execute($airport, 10, 50, $toHub);
        $midRangeAirports = $this->findAirportsWithinDistance->execute($airport, 51, 300, $toHub);
        $furtherAfieldAirports = $this->findAirportsWithinDistance->execute($airport, 301, 800, $toHub);

        $allAirports = $nearbyAirports->merge($midRangeAirports)->merge($furtherAfieldAirports);

        // pick (n) random airports
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
        $numberToHubs = 0;
        $i = 1;
        while ($i <= $numberToGenerate) {
            $destAirport = $allAirports->random(1);

            if ($airport->identifier != $destAirport[0]->identifier) {
                if ($destAirport[0]->is_hub) $numberToHubs = $numberToHubs + 1;
                $contract = $this->generateContractDetails->execute($airport, $destAirport[0]);
                $contracts[] = $contract;
            }
            $i++;
        }
        // generate one hub contract if none have been generated
        if ($numberToHubs == 0) {
            $destination = $allAirports->where('is_hub', true);
            if ($destination->count() > 0) {
                $destination = $destination->random(1);
                $hubContract = $this->generateContractDetails->execute($airport, $destination[0]);
                $contracts[] = $hubContract;
            }
        }
        return $contracts;
    }
}
