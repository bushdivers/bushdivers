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
            ]
        ]);
    }
}
