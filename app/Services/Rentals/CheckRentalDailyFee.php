<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Enums\TransactionTypes;
use App\Models\Pirep;
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
        $aircraft = Aircraft::with('fleet')
            ->where('is_rental', true)
            ->where('user_id', '<>', null)
            ->get();

        foreach ($aircraft as $ac) {
            // check if flown more than 2 hours
            $pirepTime = Pirep::where('aircraft_id', $ac->id)
                ->where('user_id', $ac->user_id)
                ->whereBetween('submitted_at', [Carbon::today(), Carbon::tomorrow()->subSeconds(2)])
                ->sum('flight_time');

            if ($pirepTime < 120) {
                $charge = $ac->fleet->rental_cost;
                $this->addUserTransaction->execute($ac->user_id, TransactionTypes::Rental, -$charge);
            }
        }
    }
}
