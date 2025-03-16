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
            $qty = random_int($minCargo, $maxCargo);
        } else {
            $qty = random_int($minPax, $maxPax);
        }
        return ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $qty];
    }

}
