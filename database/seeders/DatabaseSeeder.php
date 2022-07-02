<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\Crew::factory(10)->create();

        $this->call([
            AwardSeeder::class,
            ContractTypeSeeder::class,
            //ContractSeeder::class,
            //ContractCargoSeeder::class,
            RankSeeder::class,
            FleetSeeder::class,
            AircraftSeeder::class,
            AirportSeeder::class,
            ResourceCategorySeeder::class
        ]);

    }
}
