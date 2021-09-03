<?php

namespace App\Services;

use App\Models\Aircraft;

class AircraftService
{
    public function findAircraftFromString(string $name): ?Aircraft
    {
        $array = explode(' ', $name);
        $reg = $array[count($array)-1];
        return Aircraft::where('registration', $reg)->first();
    }
}
