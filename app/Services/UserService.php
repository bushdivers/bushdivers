<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function updatePilotHours($flightHours, $userId)
    {
        $user = User::find($userId);
        $user->flights_time = $user->flights_time + $flightHours;
        $user->flights = $user->flights + 1;
        $user->save();
    }

    public function updatePilotLocation($icao, $userId)
    {
        $user = User::find($userId);
        $user->current_airport_id = $icao;
        $user->save();
    }
}
