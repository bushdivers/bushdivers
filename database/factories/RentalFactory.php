<?php

namespace Database\Factories;

use App\Models\Airport;
use App\Models\Fleet;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 *  @extends Factory<Rental>
 */
class RentalFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Rental::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'registration' => 'N123R',
            'fleet_id' => Fleet::factory(),
            'user_id' => User::factory(),
            'current_airport_id' => Airport::factory(),
            'rental_airport_id' => fn (array $attr) => $attr['current_airport_id'],
        ];
    }
}
