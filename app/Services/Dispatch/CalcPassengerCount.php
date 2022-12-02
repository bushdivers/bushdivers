<?php

namespace App\Services\Dispatch;

class CalcPassengerCount
{
    public function execute($cargo): int
    {
        $pax = $cargo->where('cargo_type', 2);
        return $pax->sum('cargo_qty');
    }
}
