<?php

namespace App\Services\Contracts;

use App\Models\Enums\ContractValueTypes;

class CalcContractValue
{
    public function execute($type, $cargo, $distance): float
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
}
