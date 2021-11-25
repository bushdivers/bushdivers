<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class GetAircraftFromString
{
    public function execute(string $name): ?Aircraft
    {
        $array = explode(' ', $name);
        $reg = $array[count($array)-1];
        return Aircraft::where('registration', $reg)->first();
    }
}
