<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class UpdateAircraftFerry
{
    public function execute($aircraftId, $airportId)
    {
        $ac = Aircraft::find($aircraftId);
        if ($ac->hub_id === $airportId && $ac->is_ferry) {
            $ac->is_ferry = false;
            $ac->ferry_user_id = null;
            $ac->save();
        }
    }
}
