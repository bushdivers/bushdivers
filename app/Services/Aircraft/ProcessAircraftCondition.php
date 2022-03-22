<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\MaintenanceTypes;

class ProcessAircraftCondition
{
    protected CalculateEngineWear $calculateEngineWear;
    protected CalculateAircraftWear $calculateAircraftWear;
    protected UpdateAircraftCondition $updateAircraftCondition;

    public function __construct(CalculateAircraftWear $calculateAircraftWear, CalculateEngineWear $calculateEngineWear, UpdateAircraftCondition $updateAircraftCondition)
    {
        $this->calculateEngineWear = $calculateEngineWear;
        $this->calculateAircraftWear = $calculateAircraftWear;
        $this->updateAircraftCondition = $updateAircraftCondition;
    }

    public function execute($aircraftId, $landingRate = 0)
    {
        $aircraft = Aircraft::find($aircraftId);
        $engines = AircraftEngine::where('aircraft_id', $aircraftId)->get();

        $aircraftWear = $this->calculateAircraftWear->execute($aircraft);
        if ($landingRate >= 200 && $landingRate < 350) {
            $aircraftWear = round($aircraftWear * 1.5);
        } elseif ($landingRate >= 350) {
            $aircraftWear = round($aircraftWear * 2.5);
        }
        $this->updateAircraftCondition->execute($aircraftId, MaintenanceTypes::GeneralMaintenance, $aircraft->wear - $aircraftWear);

        foreach ($engines as $engine) {
            $engineWear = $this->calculateEngineWear->execute($engine);
            $this->updateAircraftCondition->execute($aircraftId, MaintenanceTypes::EngineMaintenance, $engine->wear - $engineWear, $engine->id);
        }
    }
}
