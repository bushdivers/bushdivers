<?php

namespace App\Services\User;

use App\Models\User;

class UpdateUserLocation
{
    public function execute($icao, $userId)
    {
        $user = User::find($userId);
        $user->current_airport_id = $icao;
        $user->save();
    }
}
