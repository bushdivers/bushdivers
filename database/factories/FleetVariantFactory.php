<?php

namespace Database\Factories;

use App\Models\FleetVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FleetVariant>
 */
class FleetVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fleet_id' => \App\Models\Fleet::factory(),
            'name' => 'Standard',
            'is_default' => true,
            'pax_capacity' => 7,
            'cargo_capacity' => 800,
            'fuel_capacity' => 200,
            'range' => 1200,
            'mtow' => 3100,
            'zfw' => 2000,
        ];
    }
}
