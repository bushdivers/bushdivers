<?php

namespace App\Services;

use App\Models\Airport;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function updatePilotHours($flightHours, $userId)
    {
        $user = User::find($userId);
        $user->flights_time += $flightHours;
        $user->flights += 1;
        $user->save();
    }

    public function updatePilotLocation($icao, $userId)
    {
        $user = User::find($userId);
        $user->current_airport_id = $icao;
        $user->save();
    }

    public function updateUserAccountBalance($userId, $value)
    {
        $user = User::find($userId);
        $user->account_balance += $value;
        $user->save();
    }

    public function addUserAccountEntry($userId, $type, $value, $flightId = null)
    {
        DB::table('user_accounts')->insert([
            'user_id' => $userId,
            'type' => $type,
            'total' => $value,
            'flight_id' => $flightId,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }
}
