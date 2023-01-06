<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Models\Rental;
use App\Services\Finance\AddUserTransaction;
use App\Services\Finance\GetUserBalance;
use Illuminate\Support\Facades\Auth;

class StartRental
{
    protected AddUserTransaction $addUserTransaction;
    protected GetUserBalance $getUserBalance;
    protected string $reg = '';

    public function __construct(AddUserTransaction $addUserTransaction, GetUserBalance $getUserBalance)
    {
        $this->addUserTransaction = $addUserTransaction;
        $this->getUserBalance = $getUserBalance;
    }

    public function execute($id, $userId, $icao): bool
    {
        $fleet = Fleet::find($id);
        $airport = Airport::where('identifier', $icao)->first();
        $deposit = $fleet->rental_cost * 10;

        // check user can afford
        if ($this->getUserBalance->execute($userId) < $deposit) {
            return false;
        }

        $reg = $this->findAvailableReg($airport->country);

        $rental = new Rental();
        $rental->registration = $reg;
        $rental->user_id = $userId;
        $rental->fleet_id = $id;
        $rental->current_airport_id = $icao;
        $rental->rental_airport_id = $icao;
        $rental->save();

        // process financials
        $this->addUserTransaction->execute($userId, TransactionTypes::Rental, -$deposit);

        return true;
    }

    protected function findAvailableReg(?string $country): string
    {
        $valid = false;
        $reg = '';
        if ($country == 'PG' || $country == 'ID') {
           $qty = 3;
        } else {
            $qty = 4;
        }

        while ($valid == false) {
            $num = [];
            if ($country == 'PG' || $country == 'ID') {
                for ($i = 0; $i < $qty; $i++) {
                    $num[$i] = mt_rand(0, 9);
                }
                $reg = 'P2-R'.$num[0].$num[1].$num[2];
            } else {
                for ($i = 0; $i < $qty; $i++) {
                    $num[$i] = mt_rand(0, 9);
                }
                $reg = 'N'.$num[0].$num[1].$num[2].$num[3].'R';
            }

            $rental = Rental::where('registration', $reg)
                ->count();
            if ($rental == 0) {
                $valid = true;
            }
        }
        return $reg;
    }
}
