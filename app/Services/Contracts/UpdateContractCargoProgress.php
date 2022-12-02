<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use Carbon\Carbon;

class UpdateContractCargoProgress
{
    public function execute($cargo, string $icao, $pirepId = null)
    {
        $contractCargo = Contract::find($cargo);
        $contractCargo->current_airport_id = $icao;
        $contractCargo->active_pirep = null;

        // check if cargo item is completed

        if ($icao == $contractCargo->arr_airport_id) {
            $contractCargo->is_completed = true;
            $contractCargo->completed_pirep = $pirepId;
            $contractCargo->completed_at = Carbon::now();
        }
        $contractCargo->save();
    }
}
