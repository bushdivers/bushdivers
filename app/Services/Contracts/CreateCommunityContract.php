<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\CommunityJobContract;
use App\Services\Airports\CalcBearingBetweenPoints;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Carbon\Carbon;

class CreateCommunityContract
{
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;
    protected CalcBearingBetweenPoints $calcBearingBetweenPoints;
    protected CalcContractValue $calcContractValue;
    protected StoreContracts $storeContracts;

    public function __construct(CalcDistanceBetweenPoints $calcDistanceBetweenPoints, StoreContracts $storeContracts, CalcBearingBetweenPoints $calcBearingBetweenPoints, CalcContractValue $calcContractValue)
    {
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
        $this->calcBearingBetweenPoints = $calcBearingBetweenPoints;
        $this->calcContractValue = $calcContractValue;
        $this->storeContracts = $storeContracts;
    }
    public function execute(CommunityJobContract $job)
    {
        $depAirport = Airport::find($job->dep_airport_id);
        $arrAirport = Airport::find($job->arr_airport_id);
        $cargo = ['name' => $job->cargo, 'type' => $job->cargo_type, 'qty' => $job->cargo_type == 1 ? $job->payload : $job->pax];

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
