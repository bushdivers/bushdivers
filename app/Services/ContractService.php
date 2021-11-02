<?php

namespace App\Services;

use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\ContractType;
use App\Models\Enums\ContractValueTypes;
use App\Models\PirepCargo;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ContractService
{
    protected $minQtyJobs = 10;
    protected $maxQtyJobs = 20;
    protected $maxQtyHubJobs = 60;
    protected AirportService $airportService;

    public function __construct()
    {
        $this->airportService = new AirportService();
    }

    public function findAirportsInNeedOfContracts()
    {
        // find all airports in PNG area
        try {
            $airports = Airport::where('lat', '<', 0)
                ->whereIn('country', ['ID', 'PG'])
                ->get();

            foreach ($airports as $airport) {
                $currentJobs = Contract::where('dep_airport_id', $airport->identifier)
                    ->where('is_available', true)
                    ->where('expires_at', '>', Carbon::now())
                    ->count();

                if ($currentJobs < $this->minQtyJobs) {
                    $numberToGenerate = $this->maxQtyJobs - $currentJobs;
                    $this->generateContracts($airport, $numberToGenerate);
                }
            }
        }
        catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Finding airports for contract generation']);
        }
    }

    public function findHubsInNeedOfContracts()
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
            $numberToGenerate = $this->maxQtyHubJobs - $currentJobs;
            $this->generateContracts($hub, $numberToGenerate);

            // INTO HUB
            // find airports 100 nm from hub
//            $airports = $this->airportService->findAirportsWithinDistance($hub, 200);
            // generate a contract into the hub for each of those airports (up to 50)
            $numberHubJobsToGenerate = $this->maxQtyHubJobs - $currentJobsIn;
            if ($numberHubJobsToGenerate > 0) {
                $airports = $this->airportService->findAirportsWithinDistance($hub, 200);
                // generate contracts
                if ($airports->count() < $numberHubJobsToGenerate) {
                    foreach ($airports as $origin) {
                        if ($origin->identifier != $hub->identifier) {
                            $this->generateContractToHub($origin, $hub);
                        }
                    }
                } else {
                    $originAirports = $airports->random($numberHubJobsToGenerate);
                    foreach ($originAirports as $origin) {
                        if ($origin->identifier != $hub->identifier) {
                            $this->generateContractToHub($origin, $hub);
                        }
                    }
                }
            }

        }
    }

    public function generateHubContracts($airport, $number)
    {
        $hubs = Airport::where('is_hub', true)->get();
        $this->generateContractDetails($airport, $hubs);
    }

    public function generateContracts($airport, $number)
    {
        try {
            // divide number by 3 (n)
            $qtyPerRange = round($number / 3);

            // get airports within 50nm
            $airports50 = $this->airportService->findAirportsWithinDistance($airport, 50);
            // get airports within > 50 <= 150nm
            $airports150 = $this->airportService->findAirportsWithinDistance($airport, 150);
            // get airports within > 150nm
            $airportsMax = $this->airportService->findAirportsWithinDistance($airport, 500);

            // pick (n) random airports in each category
            if ($airports50->count() <= $qtyPerRange && $airports50->count() > 0) {
                $this->generateContractDetails($airport, $airports50);
            } elseif ($airports50->count() > 0) {
                $this->generateContractDetails($airport, $airports50->random($qtyPerRange));
            }

            if ($airports150->count() <= $qtyPerRange && $airports150->count() > 0) {
                $this->generateContractDetails($airport, $airports150);
            } elseif ($airports150->count() > 0) {
                $this->generateContractDetails($airport, $airports150->random($qtyPerRange));
            }

            if ($airportsMax->count() <= $qtyPerRange && $airportsMax->count() > 0) {
                $this->generateContractDetails($airport, $airportsMax);
            } elseif ($airportsMax->count() > 0) {
                $this->generateContractDetails($airport, $airportsMax->random($qtyPerRange));
            }
        }
        catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract base generation']);
        }
    }

    public function generateContractDetails($origin, $airports)
    {
        try {
            foreach ($airports as $airport) {
                if ($origin->identifier != $airport->identifier) {
                    // generate cargo
                    $cargo = $this->generateCargo();
                    // get distance and heading
                    $distance = $this->airportService->calculateDistanceBetweenPoints($origin->lat, $origin->lon, $airport->lat, $airport->lon);
                    $heading = $this->airportService->calculateBearingBetweenPoints($origin->lat, $origin->lon, $airport->lat, $airport->lon, $airport->magnetic_variance);
                    $contractValue = $this->calculateContractValue($cargo['type'], $cargo['qty'], $distance);
                    // create contract
                    $this->saveContract($origin->identifier, $airport->identifier, $distance, $heading, $cargo, $contractValue);
                }
            }

        } catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract details generation']);
        }

    }

    public function generateContractToHub($origin, $hub)
    {
        try {
                // generate cargo
                $cargo = $this->generateCargo();
                // get distance and heading
                $distance = $this->airportService->calculateDistanceBetweenPoints($origin->lat, $origin->lon, $hub->lat, $hub->lon);
                $heading = $this->airportService->calculateBearingBetweenPoints($origin->lat, $origin->lon, $hub->lat, $hub->lon, $hub->magnetic_variance);
                $contractValue = $this->calculateContractValue($cargo['type'], $cargo['qty'], $distance);
                // create contract
                $this->saveContract($origin->identifier, $hub->identifier, $distance, $heading, $cargo, $contractValue);
        } catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract details generation']);
        }
    }

    public function generateCargo(): array
    {
        $qty = 0;
        $types = DB::table('cargo_types')->get();
        $cargo = $types->random();
        if ($cargo->type == 1) {
            // random qty cargo = 500 - 10000 lbs
            $qty = rand(100, 10000);
        } else {
            // random qty pax = 1-20
            $qty = rand(1, 15);
        }
        return ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $qty];
    }

    public function saveContract($start, $dest, $distance, $heading, $cargo, $value)
    {
//        dd($start);
        $contract = new Contract();
        $contract->dep_airport_id = $start;
        $contract->arr_airport_id = $dest;
        $contract->distance = $distance;
        $contract->heading = $heading;
        $contract->contract_value = $value;
        $contract->expires_at = Carbon::now()->addDays(rand(1,8));
        $contract->save();

        $contractCargo = new ContractCargo();
        $contractCargo->contract_id = $contract->id;
        $contractCargo->current_airport_id = $start;
        if ($cargo['type'] == 1) {
            $contractCargo->contract_type_id = ContractType::Cargo;
        } else {
            $contractCargo->contract_type_id = ContractType::Passenger;
        }
        $contractCargo->cargo = $cargo['name'];
        $contractCargo->cargo_qty = $cargo['qty'];
        $contractCargo->save();


    }

    public function calculateContractValue($type, $cargo, $distance): float
    {
        $weightMultiplier = ContractValueTypes::CARGO_VALUE;
        $paxMultiplier = ContractValueTypes::PAX_VALUE;
        $distanceMultiplier = ContractValueTypes::DISTANCE_VALUE;
        if ($type == 1) {
            $cargoValue = $cargo * $weightMultiplier;
            $distanceValue = ($distance / 50) * $distanceMultiplier;
            return round($cargoValue + $distanceValue);
        } else {
            $cargoValue = $cargo * $paxMultiplier;
            $distanceValue = ($distance / 50) * $distanceMultiplier;
            return round($cargoValue + $distanceValue);
        }
    }

    public function updateCargo($cargo, $icao)
    {
        $contractCargo = ContractCargo::find($cargo);
        $contract = Contract::find($contractCargo->contract_id);
        $contractCargo->current_airport_id = $icao;
        $contractCargo->save();

            // check if cargo item is completed

        if ($icao == $contract->arr_airport_id) {
            $contractCargo->is_completed = true;
            $contractCargo->completed_at = Carbon::now();
            $contractCargo->save();
        }

        $this->setContractCompleted($contract);
    }

    public function setContractCompleted($contract)
    {

        $cargo = ContractCargo::where('contract_id', $contract->id)->count();
        $cargoCompleted = ContractCargo::where('is_completed', true)->where('contract_id', $contract->id)->count();
        $con = Contract::find($contract->id);

        if ($cargo == $cargoCompleted) {
            $con->is_completed = true;
            $con->completed_at = Carbon::now();
            $con->save();
        }
    }

    public function removeStaleContracts()
    {
        Contract::where('user_id', null)
            ->where('is_completed', false)
            ->where('expires_at', '<', Carbon::now())
            ->delete();
    }
}
