<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('contracts')->insert([
            [
                'id' => 1,
                'dep_airport_id' => 'AYMR',
                'arr_airport_id' => 'AYMH',
                'distance' => 60,
                'heading' => 63,
                'contract_value' => 400,
                'expires_at' => Carbon::today()->addYear(1),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'dep_airport_id' => 'AYMR',
                'arr_airport_id' => 'AYMN',
                'distance' => 28,
                'heading' => 63,
                'contract_value' => 400,
                'expires_at' => Carbon::today()->addYear(1),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
