<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\Enums\ContractValueTypes;
use App\Models\Enums\TransactionTypes;
use App\Services\Finance\AddUserTransaction;

class UpdateAircraftFerry
{
    protected AddUserTransaction $addUserTransaction;
    public function __construct(AddUserTransaction $addUserTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
    }
    public function execute($aircraftId, $airportId)
    {
        $ac = Aircraft::with('fleet')->find($aircraftId);
        if ($ac->hub_id === $airportId && $ac->is_ferry) {
            // pay user
            $sizeMultiplier = match ($ac->fleet->size) {
                'S' => 1.5,
                'M' => 2,
                'L' => 2.5,
                default => 1,
            };
            $distanceValue = round(($ac->ferry_distance * 1.2) * 12, 2);
            $pilotPay = round($distanceValue * $sizeMultiplier, 2);
            $this->addUserTransaction->execute($ac->ferry_user_id, TransactionTypes::FlightPay, $pilotPay);

            // update aircraft status
            $ac->is_ferry = false;
            $ac->ferry_user_id = null;
            $ac->ferry_distance = null;
            $ac->save();
        }
    }
}
