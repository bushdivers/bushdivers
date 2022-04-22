<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\ContractInfo;
use App\Models\Enums\ContractType;
use App\Services\Airports\CalcBearingBetweenPoints;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CreateCustomRoute
{
    protected StoreContract $storeContract;
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;
    protected CalcBearingBetweenPoints $calcBearingBetweenPoints;
    protected CalcContractValue $calcContractValue;

    public function __construct(
        StoreContract $storeContract,
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

            $data = new ContractInfo();
            $data->setStart($dep);
            $data->setDest($arr);
            $data->setDistance($distance);
            $data->setHeading($heading);
            $data->setCargo($cargo);
            $data->setValue($value);
            $data->setCustom(true);
            $data->setUserId($userId);

            $this->storeContract->execute($data, Carbon::now()->addDays(rand(1,8)));
        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException();
        }

    }
}
