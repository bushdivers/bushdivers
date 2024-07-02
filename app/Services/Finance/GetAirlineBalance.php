<?php

namespace App\Services\Finance;

use Illuminate\Support\Facades\DB;

class GetAirlineBalance
{
    public function execute(): float
    {
        return DB::table('account_ledgers')
            ->sum('total');
    }
}
