<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AirportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('airports')->insert([
            [
                'id' => 1,
                'identifier' => 'AYMH',
                'name' => 'Mount Hagen',
                'is_hub' => 0,
                'lat' => -5.82962,
                'lon' => 144.29884,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'longest_runway_surface' => 'A',
                'longest_runway_length' => 7185,
                'altitude' => 5383,
                'has_avgas' => true,
                'avgas_qty' => 5000,
                'avgas_price' => 4.00,
                'has_jetfuel' => true,
                'jetfuel_qty' => 5000,
                'jetfuel_price' => 4.00
            ],
            [
                'id' => 2,
                'identifier' => 'AYMR',
                'name' => 'Moro',
                'is_hub' => 1,
                'lat' => -6.36188,
                'lon' => 143.23070,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'longest_runway_surface' => 'A',
                'longest_runway_length' => 5972,
                'altitude' => 2741,
                'has_avgas' => true,
                'avgas_qty' => null,
                'avgas_price' => 4.00,
                'has_jetfuel' => true,
                'jetfuel_qty' => null,
                'jetfuel_price' => 4.00
            ],
            [
                'id' => 3,
                'identifier' => 'AYMN',
                'name' => 'Mendi',
                'is_hub' => 0,
                'lat' => -6.147739,
                'lon' => 143.657164,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'longest_runway_surface' => 'A',
                'longest_runway_length' => 4411,
                'altitude' => 5680,
                'has_avgas' => true,
                'avgas_qty' => 0,
                'avgas_price' => 4.00,
                'has_jetfuel' => true,
                'jetfuel_qty' => 0,
                'jetfuel_price' => 4.00
            ]
        ]);

        DB::table('airports')->insert([
            [
                'identifier' => 'AYGN',
                'name' => 'Gurney',
                'is_hub' => 0,
                'lat' => -10.306832,
                'lon' => 150.333499,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'longest_runway_surface' => 'A',
                'longest_runway_length' => 5547,
                'altitude' => 67,
                'has_avgas' => true,
                'avgas_qty' => 5000,
                'avgas_price' => 4.00,
                'has_jetfuel' => true,
                'jetfuel_qty' => 5000,
                'jetfuel_price' => 4.00,
                'is_thirdparty' => true,
            ],

        ]);
    }
}
