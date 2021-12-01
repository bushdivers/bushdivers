<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\TransactionTypes;
use App\Services\Aircraft\UpdateAircraftLocation;
use App\Services\Aircraft\UpdateAircraftState;
use App\Services\AircraftService;
use App\Services\Finance\AddUserTransaction;

class EndRental
{
    protected UpdateAircraftLocation $updateAircraftLocation;
    protected UpdateAircraftState $updateAircraftState;
    protected AddUserTransaction $addUserTransaction;

    public function __construct(
        UpdateAircraftLocation $updateAircraftLocation,
        UpdateAircraftState $updateAircraftState,
        AddUserTransaction $addUserTransaction
    )
    {
        $this->updateAircraftLocation = $updateAircraftLocation;
        $this->updateAircraftState = $updateAircraftState;
        $this->addUserTransaction = $addUserTransaction;
    }

    public function execute($aircraftId, $userId)
    {
        $aircraft = Aircraft::with('fleet')->find($aircraftId);

        // check current location
        if ($aircraft->current_airport_id == $aircraft->hub_id) {
            // return deposit to user
            $deposit = $aircraft->fleet->rental_cost * 10;
            $this->addUserTransaction->execute($userId, TransactionTypes::Rental, $deposit);
        } else {
            // update aircraft location
            $this->updateAircraftLocation->execute($aircraftId, $aircraft->hub_id);
        }
        // update aircraft status
        $this->updateAircraftState->execute($aircraftId, AircraftState::AVAILABLE);
    }
}
