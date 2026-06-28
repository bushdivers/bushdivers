<?php

namespace App\Services\User;

use App\Models\User;

class UpdateUserHours
{
    public function execute($flightHours, $userId): void
    {
        $user = User::find($userId);
        $user->flights_time += $flightHours;
        $user->flights += 1;
        $user->save();
    }
}
