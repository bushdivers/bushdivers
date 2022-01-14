<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AircraftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('aircraft')->insert([
            [
                'id' => 1,
                'fleet_id' => 1,
                'registration' => 'P2-CVA',
                'fuel_onboard' => 26.8,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYMH',
                'last_lat' => -5.82962,
                'last_lon' => 144.29884,
                'hub_id' => 'AYMH',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0

            ],
            [
                'id' => 2,
                'fleet_id' => 1,
                'registration' => 'P2-CVB',
                'fuel_onboard' => 20.8,
                'flight_time_mins' => 456,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYMH',
                'last_lat' => -5.82962,
                'last_lon' => 144.29884,
                'hub_id' => 'AYMR',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0

            ],
            [
                'id' => 3,
                'fleet_id' => 6,
                'registration' => 'P2-PPA',
                'fuel_onboard' => 30.8,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYMR',
                'last_lat' => -6.36188,
                'last_lon' => 143.23070,
                'hub_id' => 'AYMR',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ],
            [
                'id' => 4,
                'fleet_id' => 2,
                'registration' => 'P2-CES',
                'fuel_onboard' => 46.8,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYMR',
                'last_lat' => -6.36188,
                'last_lon' => 143.23070,
                'hub_id' => 'AYMR',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ],
            [
                'id' => 5,
                'fleet_id' => 5,
                'registration' => 'P2-XCB',
                'fuel_onboard' => 34.8,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYWK',
                'last_lat' => -3.58414,
                'last_lon' => 143.66878,
                'hub_id' => 'AYGA',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ],
            [
                'id' => 6,
                'fleet_id' => 3,
                'registration' => 'P2-KIA',
                'fuel_onboard' => 123.8,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYMR',
                'last_lat' => 1.234,
                'last_lon' => 5.354,
                'hub_id' => 'AYMR',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ],
            [
                'id' => 7,
                'fleet_id' => 3,
                'registration' => 'P2-KIB',
                'fuel_onboard' => 166.8,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYGA',
                'last_lat' => -6.08348,
                'last_lon' => 145.39154,
                'hub_id' => 'AYMI',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ],
            [
                'id' => 8,
                'fleet_id' => 7,
                'registration' => 'P2-HEL',
                'fuel_onboard' => 123.4,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYGA',
                'last_lat' => -6.08348,
                'last_lon' => 145.39154,
                'hub_id' => 'AYMR',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ],
            [
                'id' => 9,
                'fleet_id' => 4,
                'registration' => 'P2-BNI',
                'fuel_onboard' => 47.8,
                'flight_time_mins' => 123,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYGA',
                'last_lat' => -6.08348,
                'last_lon' => 145.39154,
                'hub_id' => 'AYMR',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ],
            [
                'id' => 10,
                'fleet_id' => 8,
                'registration' => 'P2-KOD',
                'fuel_onboard' => 145.8,
                'flight_time_mins' => 11723,
                'state' => 1,
                'status' => 1,
                'current_airport_id' => 'AYGA',
                'last_lat' => -6.08348,
                'last_lon' => 145.39154,
                'hub_id' => 'AYMR',
                'last_flight' => Carbon::yesterday(),
                'last_inspected_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'user_id' => 1,
                'owner_id' => 0
            ]
        ]);
    }
}
