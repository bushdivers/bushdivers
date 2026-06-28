<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\CommunityJobContract;
use App\Models\Enums\CargoType;
use App\Models\Enums\ContractType;
use Carbon\Carbon;

class CreateCommunityContract
{
    public function __construct(
        protected StoreContracts $storeContracts,
        protected CalcContractValue $calcContractValue
    ) {
    }

    public function execute(CommunityJobContract $job): void
    {
        $depAirport = Airport::find($job->dep_airport_id);
        $arrAirport = Airport::find($job->arr_airport_id);
        $cargo = ['name' => $job->cargo, 'type' => $job->cargo_type, 'qty' => $job->cargo_type == CargoType::Cargo ? $job->payload : $job->pax];

        // contract info
        $distance = $depAirport->distanceTo($arrAirport);
        $heading = $depAirport->bearingTo($arrAirport);

        $value = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);
        // add contract
        $data = [[
            'departure' => $depAirport->identifier,
            'destination' => $arrAirport->identifier,
            'distance' => $distance,
            'heading' => $heading,
            'contract_value' => $value,
            'cargo' => $cargo['name'],
            'cargo_type' => $cargo['type'],
            'cargo_qty' => $cargo['qty'],
            'expires_at' => Carbon::now()->addDays(7),
            'is_fuel' => false
        ]];
        $this->storeContracts->execute($data, false, false, null, ContractType::Community, true, $job);
    }
}
