<?php

namespace App\Services\Contracts;

use App\Services\Airports\CalcDistanceBetweenPoints;
use Illuminate\Support\Facades\Log;

class GenerateContractToHub
{
    protected StoreContract $storeContract;
    protected GenerateContractCargo $generateContractCargo;
    protected CalcContractValue $calcContractValue;
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;

    public function __construct(
        StoreContract $storeContract,
        GenerateContractCargo $generateContractCargo,
        CalcContractValue $calcContractValue,
        CalcDistanceBetweenPoints $calcDistanceBetweenPoints
    )
    {
        $this->storeContract = $storeContract;
        $this->generateContractCargo = $generateContractCargo;
        $this->calcContractValue = $calcContractValue;
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
    }

    public function execute($origin, $hub)
    {
        try {
            // generate cargo
            $cargo = $this->generateContractCargo->execute();
            // get distance and heading
            $distance = $this->calcDistanceBetweenPoints->execute($origin->lat, $origin->lon, $hub->lat, $hub->lon);
            $heading = $this->calcDistanceBetweenPoints->execute($origin->lat, $origin->lon, $hub->lat, $hub->lon, $hub->magnetic_variance);
            $contractValue = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);
            // create contract
            $this->storeContract->execute($origin->identifier, $hub->identifier, $distance, $heading, $cargo, $contractValue);
        } catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract details generation']);
        }
    }
}
