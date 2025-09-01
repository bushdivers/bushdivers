<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ManufacturerSeeder extends Seeder
{
    public function run()
    {
        DB::table('manufacturers')->insert([
            ['id' => 1, 'name' => 'Cessna', 'logo_url' => '', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['id' => 2, 'name' => 'Piper', 'logo_url' => '', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
