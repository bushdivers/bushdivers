<?php

namespace App\Services;

class DispatchService
{
    protected float $personWeight = 176.00;
    protected float $avgasWeight = 5.99;
    protected float $jetFuelWeight = 6.79;

    public function calculateFuelWeight($fuelType, $fuel)
    {
        return $fuelType == 1 ? $fuel * $this->avgasWeight : $fuel * $this->jetFuelWeight;
    }

    public function calculateCargoWeight($cargo, $calcPax = true)
    {
        $total = 0;
        foreach ($cargo as $c) {
            if (!$calcPax) {
                if ($c->contract_type_id == 1) {
                    $total += $c->cargo_qty;
                }
            } else {
                if ($c->contract_type_id == 1) {
                    $total += $c->cargo_qty;
                } else {
                    $total += ($c->cargo_qty * $this->personWeight);
                }
            }

        }
        return $total;
    }

    public function calculatePassengerCount($cargo)
    {
        $pax = $cargo->where('contract_type_id', 2);
        return $pax->sum('cargo_qty');
    }
}
