<?php

namespace App\Services\Pireps;

use App\Models\Contract;
use App\Models\Pirep;
use App\Models\PirepCargo;

class RemoveSinglePirep
{
    public function execute($pirepId)
    {
        $pirepCargo = PirepCargo::where('pirep_id', $pirepId)->get();

        foreach ($pirepCargo as $cargo) {
            $cc = Contract::find($cargo->contract_cargo_id);
            if (!$cc)
                continue; // In case contract already cleaned
            $cc->active_pirep = null;
            $cc->save();
        }

        PirepCargo::where('pirep_id', $pirepId)->delete();
        Pirep::destroy($pirepId);
    }
}
