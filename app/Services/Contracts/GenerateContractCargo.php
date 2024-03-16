<?php

namespace App\Services\Contracts;

use Illuminate\Support\Facades\DB;

class GenerateContractCargo
{
    public function execute(): array
    {
        $minCargo = 400;
        $maxCargo = 30000;
        $minPax = 1;
        $maxPax = 30;
        $qty = 0;
        $types = DB::table('cargo_types')->get();
        $cargo = $types->random();
        if ($cargo->type == 1) {
            $qty = rand($minCargo, $maxCargo);
        } else {
            $qty = rand($minPax, $maxPax);
        }
        return ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $qty];
    }
}
