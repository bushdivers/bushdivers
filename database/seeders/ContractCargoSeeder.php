<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractCargoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('contract_cargos')->insert([
            [
                'id' => 1,
                'contract_id' => 1,
                'contract_type_id' => 1,
                'current_airport_id' => 'AYMR',
                'cargo' => 'Seeded data',
                'cargo_qty' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'contract_id' => 2,
                'contract_type_id' => 1,
                'current_airport_id' => 'AYMR',
                'cargo' => 'Seeded data',
                'cargo_qty' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
