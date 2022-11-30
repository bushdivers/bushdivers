<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\ContractInfo;
use App\Models\Enums\ContractType;
use App\Services\Airports\CalcBearingBetweenPoints;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class CreateCustomRoute
{
    protected StoreContracts $storeContract;
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;
    protected CalcBearingBetweenPoints $calcBearingBetweenPoints;
    protected CalcContractValue $calcContractValue;

    public function __construct(
        StoreContracts $storeContract,
        CalcDistanceBetweenPoints $calcDistanceBetweenPoints,
        CalcBearingBetweenPoints $calcBearingBetweenPoints,
        CalcContractValue $calcContractValue
    )
    {
        $this->storeContract = $storeContract;
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
        $this->calcBearingBetweenPoints = $calcBearingBetweenPoints;
        $this->calcContractValue = $calcContractValue;
    }

    public function execute($dep, $arr, $userId)
    {
        try {
            $depAirport = Airport::where('identifier', $dep)->firstOrFail();
            $arrAirport = Airport::where('identifier', $arr)->firstOrFail();

            // contract info
            $distance = $this->calcDistanceBetweenPoints->execute($depAirport->lat, $depAirport->lon, $arrAirport->lat, $arrAirport->lon);
            $heading = $this->calcBearingBetweenPoints->execute($depAirport->lat, $depAirport->lon, $arrAirport->lat, $arrAirport->lon, $depAirport->magnetic_variance);

            // cargo info
            $cargo = [
                'type' => ContractType::Cargo,
                'qty' => 300,
                'name' => 'Second hand goods'
            ];

            $value = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);

            // add contract
            $data = [
                'departure' => $dep,
                'destination' => $arr,
                'distance' => $distance,
                'heading' => $heading,
                'contract_value' => $value,
                'cargo' => $cargo['name'],
                'cargo_type' => $cargo['type'],
                'cargo_qty' => $cargo['qty'],
                'expires_at' => Carbon::now()->addDays(7)
            ];


            $this->storeContract->execute($data, true, Auth::user()->id);
        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException();
        }

    }
}
