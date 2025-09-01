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
    public function execute($rentalId, $userId)
    {
        $aircraft = Rental::find($rentalId);

        // update rental status
        $aircraft->is_active = false;
        $aircraft->save();
    }
}
