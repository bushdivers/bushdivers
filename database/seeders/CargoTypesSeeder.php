<?php

namespace Database\Seeders;

use App\Models\Enums\ContractType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CargoTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('cargo_types')->insert([
            ['text' => 'General Cargo', 'type' => ContractType::Cargo],
            ['text' => 'Perishable Goods', 'type' => ContractType::Cargo],
            ['text' => 'Tourists', 'type' => ContractType::Passenger],
        ]);
    }
}