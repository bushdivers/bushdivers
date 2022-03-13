<?php

namespace App\Services\Pireps;

use App\Models\ContractCargo;
use App\Models\Pirep;
use App\Models\PirepCargo;

class RemoveSinglePirep
{
    public function execute($pirepId)
    {
        $pirepCargo = PirepCargo::where('pirep_id', $pirepId)->get();

        foreach ($pirepCargo as $cargo) {
            $cc = ContractCargo::find($cargo->contract_cargo_id);
            $cc->is_available = 1;
            $cc->user_id = null;
            $cc->active_pirep = null;
            $cc->save();
        }

        PirepCargo::where('pirep_id', $pirepId)->delete();
        Pirep::destroy($pirepId);
    }
}
