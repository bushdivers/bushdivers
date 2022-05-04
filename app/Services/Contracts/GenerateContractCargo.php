<?php

namespace App\Services\Contracts;

use Illuminate\Support\Facades\DB;

class GenerateContractCargo
{
    public function execute($aircraftSize): array
    {
        switch ($aircraftSize) {
            case 'small':
                $minCargo = 100;
                $maxCargo = 1000;
                $minPax = 1;
                $maxPax = 4;
                break;
            case 'medium':
                $minCargo = 1500;
                $maxCargo = 5000;
                $minPax = 4;
                $maxPax = 12;
                break;
            case 'large':
                $minCargo = 8000;
                $maxCargo = 30000;
                $minPax = 15;
                $maxPax = 30;
                break;
        }


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
