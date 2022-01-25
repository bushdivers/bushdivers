<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\Enums\PirepState;
use Illuminate\Support\Facades\DB;

class UpdateUserAirportCount
{
    public function execute($userId)
    {
        $user = User::find($userId);
        $user->airport_count = DB::table('airports')
            ->join('pireps', function($join){
                $join->on('airports.identifier', '=', 'pireps.departure_airport_id')
                ->orOn('airports.identifier', '=', 'pireps.destination_airport_id');
            })
        ->select('airports.identifier')
        ->where('pireps.user_id', $userId)
        ->where('pireps.state', PirepState::ACCEPTED)
        ->distinct()
        ->count();

        $user->save();
    }
}
