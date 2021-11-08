<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Enums\TransactionTypes;
use App\Services\Finance\AddUserTransaction;
use App\Services\Finance\GetUserBalance;
use Illuminate\Support\Facades\Auth;

class StartRental
{
    protected AddUserTransaction $addUserTransaction;
    protected GetUserBalance $getUserBalance;

    public function __construct(AddUserTransaction $addUserTransaction, GetUserBalance $getUserBalance)
    {
        $this->addUserTransaction = $addUserTransaction;
        $this->getUserBalance = $getUserBalance;
    }

    public function execute($id, $userId): bool
    {
        // update aircraft
        $aircraft = Aircraft::with('fleet')
            ->where('id', $id)
            ->first();

        $deposit = $aircraft->fleet->rental_cost * 10;

        // check user can afford
        if ($this->getUserBalance->execute($userId) < $deposit) {
            return false;
        }

        $aircraft->user_id = $userId;
        $aircraft->save();

        // process financials
        $this->addUserTransaction->execute($userId, TransactionTypes::Rental, -$deposit);

        return true;
    }
}
