<?php

namespace App\Services\Finance;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AddUserTransaction
{
    public function execute($userId, $type, $value, $flightId = null)
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
