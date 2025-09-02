<?php

namespace Database\Factories;

use App\Models\Airport;
use App\Models\Rental;
use Illuminate\Database\Eloquent\Factories\Factory;

class RentalFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Rental::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'registration' => 'N123R',
            'current_airport_id' => Airport::factory(),
            'rental_airport_id' => fn(array $attr) => $attr['current_airport_id'],
        ];
    }
}
