<?php

namespace App\Services\Rentals;

use App\Models\Rental;

class UpdateRentalAfterFlight
{
    public function execute($id, $fuel, $location)
    {
        $rental = Rental::find($id);
        $rental->fuel_onboard = $rental->fuel_onboard - $fuel;
        $rental->current_airport_id = $location;
        $rental->save();
    }
}
