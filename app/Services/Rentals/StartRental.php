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
    protected string $reg = '';


    public function execute($id, $userId, $icao): bool
    {
        $airport = Airport::where('identifier', $icao)->first();

        $existingRental = Rental::where('current_airport_id', $icao)->where('fleet_id', $id)->where('is_active', false)->first();
        if ($existingRental) {
            $existingRental->user_id = $userId;
            $existingRental->is_active = true;
            $existingRental->rental_airport_id = $icao;
            $existingRental->save();
        } else {
            $reg = $this->findAvailableReg($airport->country);

            $rental = new Rental();
            $rental->registration = $reg;
            $rental->user_id = $userId;
            $rental->fleet_id = $id;
            $rental->current_airport_id = $icao;
            $rental->rental_airport_id = $icao;
            $rental->save();
        }

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
