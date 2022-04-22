<?php

namespace App\Services\Contracts;

use App\Services\Airports\CalcBearingBetweenPoints;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenerateContractDetails
{
//    protected StoreContract $storeContract;
    protected GenerateContractCargo $generateContractCargo;
    protected CalcContractValue $calcContractValue;
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;
    protected CalcBearingBetweenPoints $calcBearingBetweenPoints;

    public function __construct(
//        StoreContract $storeContract,
        GenerateContractCargo $generateContractCargo,
        CalcContractValue $calcContractValue,
        CalcDistanceBetweenPoints $calcDistanceBetweenPoints,
        CalcBearingBetweenPoints $calcBearingBetweenPoints
    )
    {
//        $this->storeContract = $storeContract;
        $this->generateContractCargo = $generateContractCargo;
        $this->calcContractValue = $calcContractValue;
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
        $this->calcBearingBetweenPoints = $calcBearingBetweenPoints;
    }

    public function execute($origin, $airports, $aircraftSize): array
    {
        try {
            $contracts = [];
            foreach ($airports as $airport) {
                if ($origin->identifier != $airport->identifier) {
                    // generate cargo
                    $cargo = $this->generateContractCargo->execute($aircraftSize);
                    // get distance and heading
                    $distance = $this->calcDistanceBetweenPoints->execute($origin->lat, $origin->lon, $airport->lat, $airport->lon);
                    $heading = $this->calcBearingBetweenPoints->execute($origin->lat, $origin->lon, $airport->lat, $airport->lon, $airport->magnetic_variance);
                    $expiry = Carbon::now()->addDays(rand(1,8));

                    $expiryMultiplier = match (true) {
                        $expiry > Carbon::now()->addDays(5) && $expiry < Carbon::now()->addDays(7) => 1.2,
                        $expiry > Carbon::now()->addDays(3) && $expiry < Carbon::now()->addDays(5) => 1.5,
                        $expiry > Carbon::now()->addDays(1) && $expiry < Carbon::now()->addDays(3) => 1.8,
                        $expiry < Carbon::now()->addHours(24) => 2.0,
                        default => 1.0,
                    };

                    $contractValue = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);
                    $contractValue = $contractValue * $expiryMultiplier;
                    // create contract
                    $contract = [
                        'id' => $origin->identifier.'-'.$airport->identifier,
                        'departure' => $origin->identifier,
                        'destination' => $airport,
                        'cargo' => $cargo['name'],
                        'cargo_type' => $cargo['type'],
                        'cargo_qty' => $cargo['qty'],
                        'distance' => $distance,
                        'heading' => $heading,
                        'contract_value' => $contractValue,
                        'expires_at' => $expiry
                    ];
                    $contracts[] = $contract;
                }
            }
            return $contracts;
        } catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Contract details generation']);
        }
    }
}
