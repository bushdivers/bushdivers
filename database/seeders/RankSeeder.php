<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ranks')->insert([
            ['name' => 'Trainee', 'hours' => 0, 'points' => 0, 'pilot_pay' => 25.00, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630667098/VA/ranks/01Trainee.png', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Second Officer', 'hours' => 5, 'points' => 50, 'pilot_pay' => 32.00, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630667098/VA/ranks/02SecondOfficer.png', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'First Officer', 'hours' => 15, 'points' => 150, 'pilot_pay' => 50.00, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630667098/VA/ranks/03FirstOfficer.png', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Captain', 'hours' => 45, 'points' => 450, 'pilot_pay' => 75.00, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630667098/VA/ranks/04Captain.png', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Senior Captain', 'hours' => 135, 'points' => 900, 'pilot_pay' => 100.00, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630667098/VA/ranks/05SeniorCaptain.png', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
