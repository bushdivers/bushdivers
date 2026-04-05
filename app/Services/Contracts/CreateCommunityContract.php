<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\CommunityJobContract;
use App\Models\Enums\CargoType;
use App\Services\Airports\CalcBearingBetweenPoints;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Carbon\Carbon;

class CreateCommunityContract
{
    public function __construct(
        protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints,
        protected StoreContracts $storeContracts,
        protected CalcBearingBetweenPoints $calcBearingBetweenPoints,
        protected CalcContractValue $calcContractValue
    ) {}

    public function execute(CommunityJobContract $job)
    {
        $depAirport = Airport::find($job->dep_airport_id);
        $arrAirport = Airport::find($job->arr_airport_id);
        $cargo = ['name' => $job->cargo, 'type' => $job->cargo_type, 'qty' => $job->cargo_type == CargoType::Cargo ? $job->payload : $job->pax];

        // contract info
        $distance = $this->calcDistanceBetweenPoints->execute($depAirport->lat, $depAirport->lon, $arrAirport->lat, $arrAirport->lon);
        $heading = $this->calcBearingBetweenPoints->execute($depAirport->lat, $depAirport->lon, $arrAirport->lat, $arrAirport->lon, $depAirport->magnetic_variance);

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
        $this->storeContracts->execute($data, false, false, null, 3, null, true, $job->id);
    }
}
