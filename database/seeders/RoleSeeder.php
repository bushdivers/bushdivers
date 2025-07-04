<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['id' => 1, 'role' => 'fleet_manager'],
            ['id' => 2, 'role' => 'resource_manager'],
            ['id' => 3, 'role' => 'fleet_admin'],
            ['id' => 4, 'role' => 'airport_manager'],
            ['id' => 5, 'role' => 'tour_admin'],
            ['id' => 6, 'role' => 'dispatcher'],
        ]);
    }
}
