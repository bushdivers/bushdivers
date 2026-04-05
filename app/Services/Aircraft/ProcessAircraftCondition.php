<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\MaintenanceTypes;

class ProcessAircraftCondition
{
    protected CalculateEngineWear $calculateEngineWear;
    protected CalculateAircraftWear $calculateAircraftWear;

    public function __construct(CalculateAircraftWear $calculateAircraftWear, CalculateEngineWear $calculateEngineWear)
    {
        $this->calculateEngineWear = $calculateEngineWear;
        $this->calculateAircraftWear = $calculateAircraftWear;
    }

    public function execute(Aircraft $aircraft, $landingRate = 0)
    {
        $aircraft->loadMissing('engines');

        $aircraftWear = $this->calculateAircraftWear->execute($aircraft);
        if ($landingRate >= 200 && $landingRate < 350) {
            $aircraftWear = round($aircraftWear * 1.5);
        } elseif ($landingRate >= 350) {
            $aircraftWear = round($aircraftWear * 2.5);
        }

        $aircraft->wear -= $aircraftWear;
        $aircraft->save();

        foreach ($aircraft->engines as $engine) {
            $engineWear = $this->calculateEngineWear->execute($engine);
            $engine->wear -= $engineWear;
            $engine->save();
        }
    }
}
