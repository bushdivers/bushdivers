<?php

namespace App\Services\Contracts;

use App\Models\Enums\CargoType;
use Illuminate\Support\Facades\DB;

class GenerateContractCargo
{
    public function execute(): array
    {
        $minCargo = 200;
        $maxCargo = 20000;
        $minPax = 1;
        $maxPax = 20;
        $cargo = DB::table('cargo_types')->inRandomOrder()->first();
        $step = max(1, (int) ($cargo->min_cargo_split ?? 1));

        $qty = match ($cargo->type) {
            CargoType::Cargo->value => random_int($minCargo, $maxCargo),
            CargoType::Passenger->value => random_int($minPax, $maxPax),
            default => throw new \Exception("Unknown cargo type: {$cargo->type}"),
        };

        if ($step > 1) {
            $qty = (int) (round($qty / $step) * $step);
            $qty = max($qty, $step);
        }

        return [
            'name' => $cargo->text,
            'type' => CargoType::from($cargo->type),
            'qty' => $qty
        ];
    }

}
