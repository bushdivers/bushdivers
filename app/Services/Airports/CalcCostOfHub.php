<?php

namespace App\Services\Airports;

use App\Models\Aircraft;
use App\Models\Fleet;

class CalcCostOfHub
{
    public function execute($aircraft): float
    {
        // supplies and personnel
        $supplies = 120000;
        // aircraft
        $aircraftCost = 0;
        if ($aircraft) {
            foreach ($aircraft as $ac) {
                $fleet = Fleet::find($ac['fleet_id']);
                $aircraftCost = $aircraftCost + ($fleet->used_high_price * $ac['qty']);
            }
        }

        return $aircraftCost + $supplies;
    }
}
