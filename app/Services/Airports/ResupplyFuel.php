<?php

namespace App\Services\Airports;

use Illuminate\Support\Facades\DB;

class ResupplyFuel
{
    public function execute($large = false)
    {
        $multiplier = 0;
        if ($large) {
            $mulitplier = mt_rand(500, 3000);
            DB::update('UPDATE airports SET avgas_qty = avgas_qty + ? WHERE has_avgas = true AND avgas_qty < 5000 AND size >= 4', [$mulitplier]);
            DB::update('UPDATE airports SET jetfuel_qty = jetfuel_qty + ? WHERE has_jetfuel = true AND jetfuel_qty < 5000 AND size >= 4', [$mulitplier]);
        } else {
            $mulitplier = mt_rand(50, 1000);
            DB::update('UPDATE airports SET avgas_qty = avgas_qty + ? WHERE has_avgas = true AND avgas_qty < 500 AND size <= 3', [$mulitplier]);
            DB::update('UPDATE airports SET jetfuel_qty = jetfuel_qty + ? WHERE has_jetfuel = true AND jetfuel_qty < 500 AND size <= 3', [$mulitplier]);
        }


    }
}
