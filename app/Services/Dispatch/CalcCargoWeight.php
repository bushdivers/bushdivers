<?php

namespace App\Services\Dispatch;

use App\Models\Enums\WeightConsts;

class CalcCargoWeight
{
    public function execute($cargo, $calcPax = true): float
    {
        $total = 0;
        foreach ($cargo as $c) {
            if (!$calcPax) {
                if ($c->cargo_type_id == 1) {
                    $total += $c->cargo_qty;
                }
            } else {
                if ($c->cargo_type_id == 1) {
                    $total += $c->cargo_qty;
                } else {
                    $total += ($c->cargo_qty * WeightConsts::PERSON_WEIGHT);
                }
            }

        }
        return $total;
    }
}
