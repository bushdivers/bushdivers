<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Enums\TransactionTypes;
use App\Models\Pirep;
use App\Models\Rental;
use App\Services\Finance\AddUserTransaction;
use Carbon\Carbon;

class CheckRentalDailyFee
{
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AddUserTransaction $addUserTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
    }

    public function execute()
    {
        $rentals = Rental::where('is_active', true)->get();

        foreach ($rentals as $ac) {
            // check if flown more than 2 hours
            $pirepTime = Pirep::where('aircraft_id', $ac->id)
                ->where('user_id', $ac->user_id)
                ->whereBetween('submitted_at', [Carbon::today(), Carbon::tomorrow()->subSeconds(2)])
                ->sum('flight_time');

            if ($pirepTime < 120) {
                $remainder = $pirepTime / 120; // flight time / min time
                $timeCharge = $ac->fleet->rental_cost * $remainder;
                $fullCharge = $ac->fleet->rental_cost;

                $charge = $pirepTime == 0 ? $fullCharge : $timeCharge;

                $this->addUserTransaction->execute($ac->user_id, TransactionTypes::Rental, -$charge);
            }
        }
    }
}
