<?php

namespace App\Services\Contracts;

use Illuminate\Support\Facades\DB;

class GenerateContractCargo
{
    public function execute(): array
    {
        $minCargo = 200;
        $maxCargo = 20000;
        $minPax = 1;
        $maxPax = 20;
        $qty = 0;
        $types = DB::table('cargo_types')->get();
        $cargo = $types->random();
        if ($cargo->type == 1) {
            $qty = $this->skewedRandom($minCargo, $maxCargo);
        } else {
            $qty = $this->skewedRandom($minPax, $maxPax);
        }
        return ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $qty];
    }

    protected function skewedRandom($min, $max): float|object|int
    {
        // Adjust the power value to control the skewness
        $skew = 1;
        $offset = $max - $min + 1;
        return floor($min + pow(lcg_value(), $skew) * $offset);
    }
}
