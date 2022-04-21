<?php

namespace Database\Seeders;

use App\Models\Enums\AwardType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AwardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('awards')->insert([
            ['name' => '1 Year Service', 'type' => AwardType::MONTHS, 'value' => 12, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/1Year.png'],
            ['name' => '6 Months Service', 'type' => AwardType::MONTHS, 'value' => 6, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/6Months.png'],
            ['name' => '2 Years Service', 'type' => AwardType::MONTHS, 'value' => 24, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/1Year.png'],
            ['name' => '50 Flights', 'type' => AwardType::FLIGHTS, 'value' => 50, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Flights.png'],
            ['name' => '50 Hours', 'type' => AwardType::HOURS, 'value' => 50, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Hours.png'],
            ['name' => '100 Flights', 'type' => AwardType::FLIGHTS, 'value' => 100, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Flights.png'],
            ['name' => '100 Hours', 'type' => AwardType::HOURS, 'value' => 100, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Hours.png'],
            ['name' => '200 Flights', 'type' => AwardType::FLIGHTS, 'value' => 200, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Flights.png'],
            ['name' => '200 Hours', 'type' => AwardType::HOURS, 'value' => 200, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Hours.png'],
            ['name' => '500 Flights', 'type' => AwardType::FLIGHTS, 'value' => 500, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Flights.png'],
            ['name' => '500 Hours', 'type' => AwardType::HOURS, 'value' => 500, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/50Hours.png'],
            ['name' => 'Patreon', 'type' => AwardType::BOOLEAN, 'value' => 1, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/patreon.png']
        ]);
    }
}
