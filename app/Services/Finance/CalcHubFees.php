<?php

namespace App\Services\Finance;

use App\Models\AirlineFees;
use App\Models\Airport;
use App\Models\Enums\AirlineTransactionTypes;

class CalcHubFees
{
    protected AddAirlineTransaction $addAirlineTransaction;

    public function __construct(AddAirlineTransaction $addAirlineTransaction)
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
    }

    public function execute()
    {
        $fee = AirlineFees::where('fee_type', AirlineTransactionTypes::HubRentalFees)->first();
        $hubs = Airport::where('is_hub', true)->get();

        foreach ($hubs as $hub) {
            $this->addAirlineTransaction->execute(AirlineTransactionTypes::HubRentalFees, $fee->fee_amount, 'Monthly Hub Rental - '. $hub->identifier);
        }
    }
}
