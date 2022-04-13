<?php

namespace App\Services\Aircraft;

class CalculateEngineWear
{
    public function execute($engine)
    {
        $wearMultiplier = 0.5;
        if ($engine->wear < 75 && $engine->wear >= 60) {
            $wearMultiplier = 0.8;
        } elseif ($engine->wear < 60 && $engine->wear >= 30) {
            $wearMultiplier = 1.4;
        } elseif ($engine->wear < 30) {
            $wearMultiplier = 2.0;
        }
        $wear = $wearMultiplier;
        return round($wear, 2);
    }
}
