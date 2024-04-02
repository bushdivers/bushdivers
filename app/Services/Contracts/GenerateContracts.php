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
        $nearbyAirports = $this->findAirportsWithinDistance->execute($airport, 2, 50, $toHub);
        $midRangeAirports = $this->findAirportsWithinDistance->execute($airport, 51, 250, $toHub);
        $furtherAfieldAirports = $this->findAirportsWithinDistance->execute($airport, 251, 650, $toHub);
        $allAirports = $nearbyAirports->merge($midRangeAirports)->merge($furtherAfieldAirports);

        if ($allAirports->count() === 0) {
            return null;
        }
        if ($allAirports->count() === 1) {
            $numberToGenerate = 4;
        }

        if ($allAirports->count() < $numberToGenerate && $allAirports->count() > 1) {
            $numberToGenerate = $numberToGenerate / 2;
        }

        if ($toHub) {
            $numberToGenerate = 1;
        }

        $contracts = [];
        $numberToHubs = 0;

        if (!$toHub) {
            $nearbyNumber = ($numberToGenerate / 100) * min(35, $nearbyAirports->count() * 3);
            $midNumber = ($numberToGenerate / 100) * min(50, $midRangeAirports->count() * 3);
            $furtherNumber = ($numberToGenerate / 100) * min(15, $furtherAfieldAirports->count() * 3);

            $near = 1;
            while ($near <= $nearbyNumber) {
                $destAirport = $nearbyAirports->random(1);
                if ($airport->identifier != $destAirport[0]->identifier) {
                    if ($destAirport[0]->is_hub) $numberToHubs = $numberToHubs + 1;
                    $contract = $this->generateContractDetails->execute($airport, $destAirport[0]);
                    $contracts[] = $contract;
                }
                $near++;
            }

            $mid = 1;
            while ($mid <= $midNumber) {
                $destAirport = $midRangeAirports->random(1);
                if ($airport->identifier != $destAirport[0]->identifier) {
                    if ($destAirport[0]->is_hub) $numberToHubs = $numberToHubs + 1;
                    $contract = $this->generateContractDetails->execute($airport, $destAirport[0]);
                    $contracts[] = $contract;
                }
                $mid++;
            }

            $far = 1;
            while ($far <= $furtherNumber) {
                $destAirport = $furtherAfieldAirports->random(1);
                if ($airport->identifier != $destAirport[0]->identifier) {
                    if ($destAirport[0]->is_hub) $numberToHubs = $numberToHubs + 1;
                    $contract = $this->generateContractDetails->execute($airport, $destAirport[0]);
                    $contracts[] = $contract;
                }
                $far++;
            }
        } else {
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
        }


        // generate one hub contract if none have been generated
        if ($numberToHubs == 0) {
            $destination = $allAirports->where('is_hub', true);
            if ($destination->count() > 0) {
                $destination = $destination->random(1);
                $hubContract = $this->generateContractDetails->execute($airport, $destination[0]);
                $contracts[] = $hubContract;
            } else {
                $destination = $allAirports->whereIn('size', [4, 5]);
                if ($destination->count() > 0) {
                    $destination = $destination->random(1);
                    $hubContract = $this->generateContractDetails->execute($airport, $destination[0]);
                    $contracts[] = $hubContract;
                }
            }
        }
        return $contracts;
    }
}
