<?php

namespace App\Services\User;

use App\Models\Airport;
use App\Models\User;

class UpdateUserLocation
{
    public function execute($icao, $userId)
    {
        $user = User::find($userId);
        $user->current_airport_id = Airport::whereIdentifier($icao)->first()->id;
        $user->save();
    }
}
