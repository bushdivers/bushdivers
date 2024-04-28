<?php

namespace App\Services\Pireps;

use App\Models\Aircraft;
use App\Models\Contract;
use App\Models\Enums\AircraftState;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\PirepCargo;

class RemoveSinglePirep
{
    public function execute(Pirep $pirep): bool
    {
        // clear up aircraft assignment
        if (!$pirep->is_rental) {
            $aircraft = Aircraft::find($pirep->aircraft_id);
            if ($aircraft) {
                $aircraft->state = AircraftState::AVAILABLE;
                $aircraft->user_id = null;
                $aircraft->save();
            }
        }

        $pirepCargo = PirepCargo::where('pirep_id', $pirep->id)->get();
        foreach ($pirepCargo as $cargo) {
            $cc = Contract::find($cargo->contract_cargo_id);
            if (!$cc)
                continue; // In case contract already cleaned
            $cc->active_pirep = null;
            $cc->save();
        }

        // Should be duplicate of above foreach
        Contract::where('active_pirep', $pirep->id)
            ->update(['active_pirep' => null]);

        PirepCargo::where('pirep_id', $pirep->id)->delete();
        FlightLog::where('pirep_id', $pirep->id)->delete();

        return $pirep->delete();
    }
}
