<?php

namespace App\Services\Finance;

use App\Models\Aircraft;
use App\Models\AirlineFees;
use App\Models\Airport;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\TransactionTypes;

class CalcLandingFee
{
    protected AddAirlineTransaction $addAirlineTransaction;
    protected AddUserTransaction $addUserTransaction;

    public function __construct(
        AddAirlineTransaction $addAirlineTransaction,
        AddUserTransaction $addUserTransaction
    )
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->addUserTransaction = $addUserTransaction;
    }

    public function execute($pirep)
    {
        $airport = Airport::where('identifier', $pirep->destination_airport_id)->first();
        if ($airport->size == 0) return;

        $aircraft = Aircraft::with('fleet')->find($pirep->aircraft_id);
        $feeType = null;
        switch ($aircraft) {
            case $aircraft->fleet->size == 'S':
                $feeType = 'Landing Fees - Small';
                break;
            case $aircraft->fleet->size == 'M':
                $feeType = 'Landing Fees - Medium';
                break;
            case $aircraft->fleet->size == 'L':
                $feeType = 'Landing Fees - Large';
                break;
        }

        $fee = AirlineFees::where('fee_name', $feeType)->first();
        if (!$aircraft->is_rental) {
            if ($aircraft->owner_id > 0) {
                $this->addUserTransaction->execute($pirep->user_id, TransactionTypes::FlightFeesLanding,
                    -$fee->fee_amount, $pirep->id);
            } else {
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::LandingFees, $fee->fee_amount, $feeType, $pirep->id);
            }
        } else {
            $this->addUserTransaction->execute($pirep->user_id, TransactionTypes::FlightFeesLanding,
                -$fee->fee_amount, $pirep->id);
        }
    }
}
