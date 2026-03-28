<?php

namespace Database\Factories;

use App\Models\Airport;
use App\Models\Fleet;
use App\Models\FleetVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class FleetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Fleet::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'type' => $this->faker->unique()->bothify('??###'),
            'name' => 'Grand Caravan',
            'manufacturer' => 'Cessna',
            'Powerplants' => 'Pratt and Whitney',
            'number_of_engines' => 1,
            'crew_required' => 1,
            'cabin_crew_required' => 0,
            'fuel_type' => 1,
            'fuel_consumption' => 16.00,
            'service_ceiling' => 25000,
            'cruise_speed' => 175,
            'image_url' => '',
            'rental_size' => 1,
            'tbo_mins' => 120000,
            'new_price' => 2000000,
            'used_low_price' => 600000,
            'used_high_price' => 1000000,
            'hq' => fn () => Airport::first() ?: Airport::factory(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Fleet $fleet) {
            FleetVariant::create([
                'fleet_id' => $fleet->id,
                'name' => 'Standard',
                'is_default' => true,
                'pax_capacity' => 7,
                'cargo_capacity' => 800,
                'fuel_capacity' => 200,
                'range' => 1200,
                'mtow' => 3100,
                'zfw' => 2000,
            ]);
        });
    }
}
