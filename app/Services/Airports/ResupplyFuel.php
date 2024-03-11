<?php

namespace App\Services\Airports;

use Illuminate\Support\Facades\DB;

class ResupplyFuel
{
    public function execute($large = false)
    {
        if ($large) {
            DB::update('UPDATE airports SET avgas_qty = avgas_qty + FLOOR(RAND()*(3000-500+1)+500) WHERE has_avgas = true AND avgas_qty < 5000 AND size >= 4');
            DB::update('UPDATE airports SET jetfuel_qty = jetfuel_qty + FLOOR(RAND()*(3000-500+1)+500) WHERE has_jetfuel = true AND jetfuel_qty < 5000 AND size >= 4');
        } else {
            DB::update('UPDATE airports SET avgas_qty = avgas_qty + FLOOR(RAND()*(1000-50+1)+50) WHERE has_avgas = true AND avgas_qty < 500 AND size <= 3');
            DB::update('UPDATE airports SET jetfuel_qty = jetfuel_qty + FLOOR(RAND()*(1000-50+1)+50) WHERE has_jetfuel = true AND jetfuel_qty < 500 AND size <= 3');
        }


    }
}
