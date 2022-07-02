<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResourceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('resource_categories')->insert([
            ['id' => 1, 'category' => 'Misc'],
            ['id' => 2, 'category' => 'Scenery'],
            ['id' => 3, 'category' => 'Aircraft'],
            ['id' => 4, 'category' => 'Livery'],
        ]);
    }
}
