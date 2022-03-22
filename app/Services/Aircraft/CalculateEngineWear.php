<?php

namespace App\Services\Aircraft;

class CalculateEngineWear
{
    public function execute($engine)
    {
        $wearMultiplier = 1;
        if ($engine->wear < 75 && $engine->wear >= 60) {
            $wearMultiplier = 1.2;
        } elseif ($engine->wear < 60 && $engine->wear >= 30) {
            $wearMultiplier = 1.4;
        } elseif ($engine->wear < 30) {
            $wearMultiplier = 3.0;
        }
        $wear = 2 * $wearMultiplier;
        return round($wear);
    }
}
