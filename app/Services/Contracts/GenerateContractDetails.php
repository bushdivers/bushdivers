<?php

namespace App\Services\Contracts;

use App\Services\Airports\CalcDistanceBetweenPoints;
use Illuminate\Support\Facades\Log;

class GenerateContractDetails
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

    public function execute($origin, $airports)
    {
        try {
            foreach ($airports as $airport) {
                if ($origin->identifier != $airport->identifier) {
                    // generate cargo
                    $cargo = $this->generateContractCargo->execute();
                    // get distance and heading
                    $distance = $this->calcDistanceBetweenPoints->execute($origin->lat, $origin->lon, $airport->lat, $airport->lon);
                    $heading = $this->calcDistanceBetweenPoints->execute($origin->lat, $origin->lon, $airport->lat, $airport->lon, $airport->magnetic_variance);
                    $contractValue = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);
                    // create contract
                    $this->storeContract->execute($origin->identifier, $airport->identifier, $distance, $heading, $cargo, $contractValue);
                }
            }

        } catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract details generation']);
        }
    }
}
