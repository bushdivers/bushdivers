<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class CargoService
{
    public function generateCargo(int $maxQty): array
    {
        $types = DB::table('cargo_types')->where('type', 1)->get();
        // select random type
        $type = $types->random();
        // generate number based on aircraft capacity
        $num = $this->generateRandomCargoQty($maxQty);

        return ['cargo_type' => $type->text, 'cargo_qty' => $num];
    }

    public function generatePax(int $maxQty): array
    {
        $types = DB::table('cargo_types')->where('type', 2)->get();
        // select random type
        $type = $types->random();
        $paxNum = $this->generateRandomCargoQty($maxQty);
        $baggage = ($paxNum * 0.8) * 20;

        return ['pax_type' => $type->text, 'pax_qty' => $paxNum, 'baggage' => $baggage];
    }

    public function generateRandomCargoQty(int $max): int
    {
        $min = round($max * ((100-60) / 100));
        return mt_rand($min, $max);
    }
}
