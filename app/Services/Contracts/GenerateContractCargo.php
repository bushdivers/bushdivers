<?php

namespace App\Services\Contracts;

use Illuminate\Support\Facades\DB;

class GenerateContractCargo
{
    public function execute(): array
    {
        $minCargo = 350;
        $maxCargo = 20000;
        $minPax = 1;
        $maxPax = 26;
        $qty = 0;
        $types = DB::table('cargo_types')->get();
        $cargo = $types->random();
        if ($cargo->type == 1) {
            // random qty cargo = 500 - 10000 lbs
            $qty = rand($minCargo, $maxCargo);
        } else {
            // random qty pax = 1-20
            $qty = rand($minPax, $maxPax);
        }
        return ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $qty];
    }
}
