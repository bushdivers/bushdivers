<?php

namespace App\Services\Rentals;

use App\Models\Airport;
use App\Models\Rental;

class UpdateRentalAfterFlight
{
    public function execute($id, $fuel, $location)
    {
        $rental = Rental::find($id);
        $rental->fuel_onboard = $rental->fuel_onboard - $fuel;
        if ($rental->fuel_onboard < 0) {
            $rental->fuel_onboard = 0;
        }

        $rental->current_airport_id = Airport::whereIdentifier($location)->first()->id;
        $rental->save();
    }
}
