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
            ['id' => 1, 'name' => '1 Year Service', 'type' => AwardType::MONTHS, 'value' => 12, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833876/BDVA/Awards/Year1_wlfbtw.png'],
            ['id' => 2, 'name' => '6 Months Service', 'type' => AwardType::MONTHS, 'value' => 6, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833876/BDVA/Awards/Months6_qjsz2y.png'],
            ['id' => 3, 'name' => '2 Years Service', 'type' => AwardType::MONTHS, 'value' => 24, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833876/BDVA/Awards/Years2_sh0xmh.png'],
            ['id' => 4, 'name' => '50 Flights', 'type' => AwardType::FLIGHTS, 'value' => 50, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833875/BDVA/Awards/Flights50_xfx4at.png'],
            ['id' => 5, 'name' => '50 Hours', 'type' => AwardType::HOURS, 'value' => 50, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833875/BDVA/Awards/Hours50_qpgbii.png'],
            ['id' => 6, 'name' => '100 Flights', 'type' => AwardType::FLIGHTS, 'value' => 100, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833875/BDVA/Awards/Flights100_sz5avf.png'],
            ['id' => 7, 'name' => '100 Hours', 'type' => AwardType::HOURS, 'value' => 100, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833875/BDVA/Awards/Hours100_nzgwp1.png'],
            ['id' => 8, 'name' => '200 Flights', 'type' => AwardType::FLIGHTS, 'value' => 200, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833875/BDVA/Awards/Flights200_ujrdpb.png'],
            ['id' => 9, 'name' => '200 Hours', 'type' => AwardType::HOURS, 'value' => 200, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833876/BDVA/Awards/Hours200_bua9ya.png'],
            ['id' => 10, 'name' => '500 Flights', 'type' => AwardType::FLIGHTS, 'value' => 500, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833875/BDVA/Awards/Flights500_smyz6r.png'],
            ['id' => 11, 'name' => '500 Hours', 'type' => AwardType::HOURS, 'value' => 500, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1651833876/BDVA/Awards/Hours500_rtcrkw.png'],
            ['id' => 12, 'name' => 'Patreon', 'type' => AwardType::BOOLEAN, 'value' => 1, 'image' => 'https://res.cloudinary.com/dpwytlrc2/image/upload/v1630673958/VA/awards/patreon.png'],
            ['id' => 13, 'name' => '50 Airports', 'type' => AwardType::AIRPORTS, 'value' => 50, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314799/BDVA/Awards/Airports50_tibw5b.png'],
            ['id' => 14, 'name' => '100 Airports', 'type' => AwardType::AIRPORTS, 'value' => 100, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314799/BDVA/Awards/Airports100_waslg4.png'],
            ['id' => 15, 'name' => '200 Airports', 'type' => AwardType::AIRPORTS, 'value' => 200, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314800/BDVA/Awards/Airports200_ya7vyu.png'],
            ['id' => 16, 'name' => '500 Airports', 'type' => AwardType::AIRPORTS, 'value' => 500, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314799/BDVA/Awards/Airports500_kuzbdz.png'],
            ['id' => 17, 'name' => '500 nm', 'type' => AwardType::DISTANCE, 'value' => 500, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314800/BDVA/Awards/Distance500_q9lbki.png'],
            ['id' => 18, 'name' => '1000 nm', 'type' => AwardType::DISTANCE, 'value' => 1000, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314800/BDVA/Awards/Distance1000_aqkj7x.png'],
            ['id' => 19, 'name' => '2000 nm', 'type' => AwardType::DISTANCE, 'value' => 2000, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314800/BDVA/Awards/Distance2000_vihjxl.png'],
            ['id' => 20, 'name' => '10000 nm', 'type' => AwardType::DISTANCE, 'value' => 10000, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314800/BDVA/Awards/Distance10000_pbabny.png']
//            ['id' => 21, 'name' => 'All Hubs', 'type' => AwardType::HUB, 'value' => 1, 'image' => 'https://res.cloudinary.com/dji0yvkef/image/upload/v1658314800/BDVA/Awards/Hub_lnouzb.png'],
        ]);
    }
}
