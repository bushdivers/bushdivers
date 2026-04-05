<?php

namespace App\Services\Contracts;

use App\Models\Enums\CargoType;
use App\Models\Enums\ContractValueTypes;

class CalcContractValue
{
    public function execute(CargoType|int $type, $cargo, $distance): float
    {
        if (is_int($type)) {
            $type = CargoType::from($type);
        }

        $weightMultiplier = ContractValueTypes::CARGO_VALUE;
        $paxMultiplier = ContractValueTypes::PAX_VALUE;
        $distanceMultiplier = ContractValueTypes::DISTANCE_VALUE;
        if ($type == CargoType::Cargo) {
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
