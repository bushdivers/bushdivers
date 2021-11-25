<?php

namespace App\Services\Cargo;

class GenerateCargoQty
{
    public function execute(int $max): int
    {
        $min = round($max * ((100-60) / 100));
        return mt_rand($min, $max);
    }
}
