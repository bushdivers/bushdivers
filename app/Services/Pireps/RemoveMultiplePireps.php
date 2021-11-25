<?php

namespace App\Services\Pireps;

use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Services\Aircraft\UpdateAircraftState;

class RemoveMultiplePireps
{
    protected UpdateAircraftState $updateAircraftState;
    protected RemoveSinglePirep $removeSinglePirep;

    public function __construct(
        UpdateAircraftState $updateAircraftState,
        RemoveSinglePirep $removeSinglePirep
    )
    {
        $this->updateAircraftState = $updateAircraftState;
        $this->removeSinglePirep = $removeSinglePirep;
    }

    public function execute($pireps)
    {
        if ($pireps->count() > 1) {
            foreach ($pireps as $pirep) {
                $aircraft = Aircraft::find($pirep->aircraft_id);
                if (!$aircraft->is_rental) {
                    $this->updateAircraftState->execute($pirep->aircraft_id, AircraftState::AVAILABLE);
                    $this->removeSinglePirep->execute($pirep->id);
                }
            }
        } elseif ($pireps->count() == 1) {
            $aircraft = Aircraft::find($pireps->aircraft_id);
            if (!$aircraft->is_rental) {
                $this->updateAircraftState->execute($pireps->aircraft_id, AircraftState::AVAILABLE);
                $this->removeSinglePirep->execute($pireps->id);
            }
        }
    }
}
