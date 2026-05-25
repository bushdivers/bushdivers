<?php

namespace App\Services\Rentals;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Models\Rental;
use App\Services\Aircraft\FindAvailableRegistration;
use App\Services\Finance\AddUserTransaction;
use Illuminate\Support\Facades\Auth;

class StartRental
{
    protected string $reg = '';

    public function __construct(protected FindAvailableRegistration $findAvailableRegistration)
    {
    }

    public function execute($id, $userId, $icao): bool
    {
        $airport = Airport::where('identifier', $icao)->first();

        $existingRental = Rental::where('current_airport_id', $airport->id)->where('fleet_id', $id)->where('is_active', false)->first();
        if ($existingRental) {
            $existingRental->user_id = $userId;
            $existingRental->is_active = true;
            $existingRental->rental_airport_id = $airport->id;
            $existingRental->save();
        } else {
            $reg = $this->findAvailableRegistration->execute($airport->country_code, true);

            $rental = new Rental();
            $rental->registration = $reg;
            $rental->user_id = $userId;
            $rental->fleet_id = $id;
            $rental->current_airport_id = $airport->id;
            $rental->rental_airport_id = $airport->id;
            $rental->save();
        }

        return true;
    }
}
