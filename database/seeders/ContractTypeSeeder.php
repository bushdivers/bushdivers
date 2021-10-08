<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('contract_types')->insert([
            ['id' => 1, 'cargo_type' => 'Cargo', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['id' => 2, 'cargo_type' => 'Passenger', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['id' => 3, 'cargo_type' => 'Generic', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
        ]);
    }
}
