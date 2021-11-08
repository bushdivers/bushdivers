<?php

namespace Database\Factories;

use App\Models\Airport;
use Illuminate\Database\Eloquent\Factories\Factory;

class AirportFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Airport::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'identifier' => 'AYMR',
            'name' => 'Moro',
            'country' => 'PG',
            'is_hub' => true,
            'lat' => -6.36188,
            'lon' => 143.23070,
            'altitude' => 100,
            'size' => 4
        ];
    }
}
