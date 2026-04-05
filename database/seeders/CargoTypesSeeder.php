<?php

namespace Database\Seeders;

use App\Models\Enums\CargoType;
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
            ['text' => 'General Cargo', 'type' => CargoType::Cargo],
            ['text' => 'Perishable Goods', 'type' => CargoType::Cargo],
            ['text' => 'Tourists', 'type' => CargoType::Passenger],
        ]);
    }
}