<?php

namespace App\Services\Rentals;

use App\Models\Rental;

class EndRental
{
    public function execute($rentalId, $userId): void
    {
        $aircraft = Rental::find($rentalId);

        // update rental status
        $aircraft->is_active = false;
        $aircraft->save();
    }
}
