<?php

namespace App\Services;

use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\ContractType;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ContractService
{
    protected $minQtyJobs = 5;
    protected $maxQtyJobs = 20;
    protected AirportService $airportService;

    public function __construct()
    {
        $this->airportService = new AirportService();
    }

    public function findAirportsInNeedOfContracts()
    {
        // find all airports in PNG area
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

    public function findHubsInNeedOfContracts()
    {
        // find all airports
        $hubs = Airport::where('is_hub', true)->get();
        foreach ($hubs as $airport) {
            $currentJobs = Contract::where('dep_airport_id', $airport->identifier)
                ->whereIn('arr_airport_id', ['identifier', $hubs])
                ->where('is_available', true)
                ->where('expires_at', '>', Carbon::now())
                ->count();

            if ($currentJobs < $this->minQtyJobs) {
                $numberToGenerate = $this->maxQtyJobs - $currentJobs;
                $this->generateHubContracts($airport, $numberToGenerate);
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

    public function generateContractDetails($origin, $airports)
    {
        foreach ($airports as $airport) {
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

    public function generateCargo(): array
    {
        $qty = 0;
        $types = DB::table('cargo_types')->get();
        $cargo = $types->random();
        if ($cargo->type == 1) {
            // random qty cargo = 250 - 10,000 kg
            $qty = rand(250, 1000);
        } else {
            // random qty pax = 1-15
            $qty = rand(1, 15);
        }
        return ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $qty];
    }

    public function saveContract($start, $dest, $distance, $heading, $cargo, $value)
    {
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
        $weightMultiplier = 2.3;
        $paxMultiplier = 180;
        $distanceMultiplier = 200;
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

            $this->setContractCompleted($contract);
        }
    }

    public function setContractCompleted($contract)
    {
        $cargo = ContractCargo::where('contract_id', $contract->id)->get();
        $cargoCompleted = ContractCargo::where('is_completed', true);

        if ($cargo->count() == $cargoCompleted->count()) {
            $contract->is_completed = true;
            $contract->completed_at = Carbon::now();
            $contract->save();
        }
    }
}
