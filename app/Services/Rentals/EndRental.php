<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\TransactionTypes;
use App\Services\AircraftService;
use App\Services\Finance\AddUserTransaction;

class EndRental
{
    protected AircraftService $aircraftService;
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AircraftService $aircraftService, AddUserTransaction $addUserTransaction)
    {
        $this->aircraftService = $aircraftService;
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
            $this->aircraftService->updateAircraftLocation($aircraftId, $aircraft->hub_id);
        }
        // update aircraft status
        $this->aircraftService->updateAircraftState($aircraftId, AircraftState::AVAILABLE);
    }
}
