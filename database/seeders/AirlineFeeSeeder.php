<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AirlineFeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('airline_fees')->insert([
            ['id' => 1, 'fee_type' => 1, 'fee_name' => 'Hub Rental', 'fee_amount' => 2000.00, 'daily' => 0, 'monthly' => 1, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 2, 'fee_type' => 5, 'fee_name' => 'Cargo Handling', 'fee_amount' => 0.15, 'daily' => 0, 'monthly' => 0, 'yearly' => 0, 'fee_weight' => 1],
            ['id' => 3, 'fee_type' => 2, 'fee_name' => 'Aircraft Parking - Small', 'fee_amount' => 250.00, 'daily' => 0, 'monthly' => 1, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 4, 'fee_type' => 2, 'fee_name' => 'Aircraft Parking - Medium', 'fee_amount' => 1350.00, 'daily' => 0, 'monthly' => 1, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 5, 'fee_type' => 2, 'fee_name' => 'Aircraft Parking - Large', 'fee_amount' => 2500.00, 'daily' => 0, 'monthly' => 1, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 6, 'fee_type' => 6, 'fee_name' => 'Landing Fees - Small', 'fee_amount' => 35.00, 'daily' => 0, 'monthly' => 0, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 7, 'fee_type' => 6, 'fee_name' => 'Landing Fees - Medium', 'fee_amount' => 75.00, 'daily' => 0, 'monthly' => 0, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 8, 'fee_type' => 6, 'fee_name' => 'Landing Fees - Large', 'fee_amount' => 140.00, 'daily' => 0, 'monthly' => 0, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 9, 'fee_type' => 7, 'fee_name' => 'Avgas', 'fee_amount' => 2.15, 'daily' => 0, 'monthly' => 0, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 10, 'fee_type' => 7, 'fee_name' => 'Jet Fuel', 'fee_amount' => 1.20, 'daily' => 0, 'monthly' => 0, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 11, 'fee_type' => 3, 'fee_name' => 'Aircraft Ownership - Small', 'fee_amount' => 950.00, 'daily' => 0, 'monthly' => 1, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 12, 'fee_type' => 3, 'fee_name' => 'Aircraft Ownership - Medium', 'fee_amount' => 2000.00, 'daily' => 0, 'monthly' => 1, 'yearly' => 0, 'fee_weight' => null],
            ['id' => 13, 'fee_type' => 3, 'fee_name' => 'Aircraft Ownership - Large', 'fee_amount' => 3500.00, 'daily' => 0, 'monthly' => 1, 'yearly' => 0, 'fee_weight' => null]
        ]);
    }
}
