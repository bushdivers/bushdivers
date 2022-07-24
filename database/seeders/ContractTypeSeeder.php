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
            ['id' => 1, 'contract_type' => 'General', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['id' => 2, 'contract_type' => 'VIP', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['id' => 3, 'contract_type' => 'Community', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
        ]);
    }
}
