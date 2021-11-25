<?php

namespace App\Services\Cargo;

use Illuminate\Support\Facades\DB;

class GenerateCargo
{
    protected GenerateCargoQty $generateCargoQty;

    public function __construct(GenerateCargoQty $generateCargoQty)
    {
        $this->generateCargoQty = $generateCargoQty;
    }

    public function execute(int $maxQty): array
    {
        $types = DB::table('cargo_types')->where('type', 1)->get();
        // select random type
        $type = $types->random();
        // generate number based on aircraft capacity
        $num = $this->generateCargoQty->execute($maxQty);

        return ['cargo_type' => $type->text, 'cargo_qty' => $num];
    }
}
