<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Models\Pirep;
use App\Models\Rental;
use App\Services\Finance\AddUserTransaction;

class ChargeRentalFee
{
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AddUserTransaction $addUserTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
    }

    public function execute($pirepId)
    {
        $pirep = Pirep::find($pirepId);
        $aircraft = Rental::find($pirep->aircraft_id);
        $fleet = Fleet::find($aircraft->fleet_id);


        $flightTimeMins = $pirep->flight_time;
        $charge = ($flightTimeMins / 60) * $fleet->rental_cost;
        $this->addUserTransaction->execute($pirep->user_id, TransactionTypes::Rental, -$charge, $pirepId);
    }
}
