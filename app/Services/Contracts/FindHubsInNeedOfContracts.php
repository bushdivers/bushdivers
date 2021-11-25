<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\Contract;
use App\Models\Enums\ContractConsts;
use App\Services\Airports\FindAirportsWithinDistance;
use Carbon\Carbon;

class FindHubsInNeedOfContracts
{
    protected FindAirportsWithinDistance $findAirportsWithinDistance;
    protected GenerateContracts $generateContracts;
    protected GenerateContractToHub $generateContractToHub;

    public function __construct(
        FindAirportsWithinDistance $findAirportsWithinDistance,
        GenerateContracts $generateContracts,
        GenerateContractToHub $generateContractToHub
    )
    {
        $this->findAirportsWithinDistance =  $findAirportsWithinDistance;
        $this->generateContracts = $generateContracts;
        $this->generateContractToHub = $generateContractToHub;
    }

    public function execute()
    {
        $hubs = Airport::where('is_hub', true)->get();
        foreach ($hubs as $hub) {
            $currentJobs = Contract::where('dep_airport_id', $hub->identifier)
//                ->whereIn('arr_airport_id', ['identifier', $hubs])
                ->where('is_available', true)
                ->where('expires_at', '>', Carbon::now())
                ->count();

            $currentJobsIn = Contract::where('arr_airport_id', $hub->identifier)
//                ->whereIn('arr_airport_id', ['identifier', $hubs])
                ->where('is_available', true)
                ->where('expires_at', '>', Carbon::now())
                ->count();


            // FROM HUB
            $numberToGenerate = ContractConsts::MAX_QTY_HUB_JOBS - $currentJobs;
            $this->generateContracts->execute($hub, $numberToGenerate);

            // INTO HUB
            // find airports 100 nm from hub
//            $airports = $this->airportService->findAirportsWithinDistance($hub, 200);
            // generate a contract into the hub for each of those airports (up to 50)
            $numberHubJobsToGenerate = ContractConsts::MAX_QTY_HUB_JOBS - $currentJobsIn;
            if ($numberHubJobsToGenerate > 0) {
                $airports = $this->findAirportsWithinDistance->execute($hub, 200);
                // generate contracts
                if ($airports->count() < $numberHubJobsToGenerate) {
                    foreach ($airports as $origin) {
                        if ($origin->identifier != $hub->identifier) {
                            $this->generateContractToHub->execute($origin, $hub);
                        }
                    }
                } else {
                    $originAirports = $airports->random($numberHubJobsToGenerate);
                    foreach ($originAirports as $origin) {
                        if ($origin->identifier != $hub->identifier) {
                            $this->generateContractToHub->execute($origin, $hub);
                        }
                    }
                }
            }

        }
    }
}
