<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use App\Services\Airports\UpdateFuelAtAirport;
use Carbon\Carbon;

class UpdateContractCargoProgress
{
    protected UpdateFuelAtAirport $updateFuelAtAirport;

    public function __construct(UpdateFuelAtAirport $updateFuelAtAirport)
    {
        $this->updateFuelAtAirport = $updateFuelAtAirport;
    }

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

            if ($contractCargo->is_fuel) {
                $this->updateFuelAtAirport->execute($icao, $contractCargo->fuel_qty, $contractCargo->fuel_type, 'increment');
            }
        }
        $contractCargo->save();
    }
}
