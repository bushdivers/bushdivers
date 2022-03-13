<?php

namespace App\Services\Contracts;

use Illuminate\Support\Facades\DB;

class GenerateContractCargo
{
    public function execute(): array
    {
        $qty = 0;
        $types = DB::table('cargo_types')->get();
        $cargo = $types->random();
        if ($cargo->type == 1) {
            // random qty cargo = 500 - 10000 lbs
            $qty = rand(100, 6000);
        } else {
            // random qty pax = 1-20
            $qty = rand(1, 8);
        }
        return ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $qty];
    }
}
