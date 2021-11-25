<?php

namespace App\Services\Dispatch;

use App\Models\Enums\WeightConsts;

class CalcFuelWeight
{
    public function execute($fuelType, $fuel): float
    {
        return $fuelType == 1 ? $fuel * WeightConsts::AVGAS_WEIGHT : $fuel * WeightConsts::JET_FUEL_WEIGHT;
    }
}
