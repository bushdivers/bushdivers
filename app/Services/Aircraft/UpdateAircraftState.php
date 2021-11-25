<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class UpdateAircraftState
{
    public function execute(int $aircraft, $state, $user = null)
    {
        $aircraft = Aircraft::find($aircraft);
        $aircraft->state = $state;
        $aircraft->user_id = $user;
        $aircraft->save();
    }
}
