<?php

namespace App\Services\Cargo;

use Illuminate\Support\Facades\DB;

class GeneratePax
{
    protected GenerateCargoQty $generateCargoQty;

    public function __construct(GenerateCargoQty $generateCargoQty)
    {
        $this->generateCargoQty = $generateCargoQty;
    }

    public function execute(int $maxQty): array
    {
        $types = DB::table('cargo_types')->where('type', 2)->get();
        // select random type
        $type = $types->random();
        $paxNum = $this->generateCargoQty->execute($maxQty);
        $baggage = ($paxNum * 0.8) * 20;

        return ['pax_type' => $type->text, 'pax_qty' => $paxNum, 'baggage' => $baggage];
    }
}
