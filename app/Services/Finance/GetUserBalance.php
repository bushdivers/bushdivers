<?php

namespace App\Services\Finance;

use Illuminate\Support\Facades\DB;

class GetUserBalance
{
    public function execute($userId): float
    {
        return DB::table('user_accounts')
            ->where('user_id', $userId)
            ->sum('total');
    }
}
