<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\TransactionTypes;
use App\Models\Rental;
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

    public function execute($rentalId, $userId)
    {
        $aircraft = Rental::with('fleet')->find($rentalId);

        // check current location
        if ($aircraft->current_airport_id == $aircraft->rental_airport_id) {
            // return deposit to user
            $deposit = $aircraft->fleet->rental_cost * 10;
            $this->addUserTransaction->execute($userId, TransactionTypes::Rental, $deposit);
        }
        // update rental status
        $aircraft->is_active = false;
        $aircraft->save();
    }
}
