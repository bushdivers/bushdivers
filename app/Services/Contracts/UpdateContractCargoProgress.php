<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Pirep;
use App\Services\Airports\UpdateFuelAtAirport;
use Carbon\Carbon;

class UpdateContractCargoProgress
{
    protected UpdateFuelAtAirport $updateFuelAtAirport;

    public function __construct(UpdateFuelAtAirport $updateFuelAtAirport)
    {
        $this->updateFuelAtAirport = $updateFuelAtAirport;
    }

    public function execute(Contract $contractCargo, Airport $airport, Pirep $pirep)
    {
        $contractCargo->current_airport_id = $airport->id;
        $contractCargo->active_pirep = null;

        // check if cargo item is completed

        if ($airport->id == $contractCargo->arr_airport_id) {
            $contractCargo->is_completed = true;
            $contractCargo->completed_pirep = $pirep->id;
            $contractCargo->completed_at = Carbon::now();

            if ($contractCargo->is_fuel) {
                $this->updateFuelAtAirport->execute($airport, $contractCargo->fuel_qty, $contractCargo->fuel_type, 'increment');
            }
            if ($contractCargo->community_job_contract_id != null) {
                $communityJobCargo = CommunityJobContract::find($contractCargo->community_job_contract_id);
                $communityJob = CommunityJob::find($communityJobCargo->community_job_id);
                if (!$communityJob->is_completed) {
                    if ($communityJobCargo->cargo_type == 1) {
                        $communityJobCargo->remaining_payload = $communityJobCargo->remaining_payload - $contractCargo->cargo_qty;
                        if ($communityJobCargo->remaining_payload == 0) {
                            $communityJobCargo->is_completed = true;
                            $communityJobCargo->completed_at = Carbon::now();
                        }
                    } else {
                        $communityJobCargo->remaining_pax = $communityJobCargo->remaining_pax - $contractCargo->cargo_qty;
                        if ($communityJobCargo->remaining_pax == 0) {
                            $communityJobCargo->is_completed = true;
                            $communityJobCargo->completed_at = Carbon::now();
                        }
                    }
                    $communityJobCargo->save();
                }
            }
        }
        $contractCargo->save();
    }
}
