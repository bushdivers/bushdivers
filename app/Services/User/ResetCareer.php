<?php

namespace App\Services\User;

use App\Models\Aircraft;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Models\Rental;
use App\Models\User;
use App\Services\Finance\AddUserTransaction;
use Illuminate\Support\Facades\DB;

class ResetCareer
{
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AddUserTransaction $addUserTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
    }

    public function execute(int $userId, ): void
    {
        // user loan reset
        $user = User::find($userId);
        $user->loan = 0.00;
        $user->is_defaulted = false;
        $user->save();

        // user aircraft reset
        $aircraft = Aircraft::where('owner_id', $userId)->get();
        foreach ($aircraft as $ac) {
            $ac->owner_id = null;
            $fleet = Fleet::find($ac->fleet_id);
            if ($ac->flight_time_mins > $fleet->tbo_mins) {
                $price = $fleet->used_low_price;
            } else {
                $price = $fleet->used_high_price;
            }
            $ac->sale_price = $price;
            $ac->save();
        }

        // user rentals end
        Rental::where('user_id', $userId)->update(['is_active' => false]);

        // user transaction reset
        DB::table('user_accounts')->where('user_id', $userId)->delete();

        $this->addUserTransaction->execute($userId, TransactionTypes::Bonus, FinancialConsts::WelcomeBonus);
    }
}
