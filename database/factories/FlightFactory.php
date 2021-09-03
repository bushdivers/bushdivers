<?php

namespace Database\Factories;

use App\Models\Enums\FlightType;
use App\Models\Flight;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlightFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Flight::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => str_shuffle('d3ijdj2idj3d929jkdkajdakjsaj'),
            'flight_type' => FlightType::SCHEDULED,
            'flight_number' => 1001,
            'dep_airport_id' => 'AYMR',
            'arr_airport_id' => 'AYMH',
            'alt_airport_id' => 'AYMN',
            'distance' => 76
        ];
    }
}
