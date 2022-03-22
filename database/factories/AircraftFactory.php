<?php

namespace Database\Factories;

use App\Models\Aircraft;
use Illuminate\Database\Eloquent\Factories\Factory;

class AircraftFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Aircraft::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'current_airport_id' => 'AYMR',
            'registration' => 'P2-BDA',
            'fuel_onboard' => 26.8,
            'state' => 1,
            'status' => 1,
            'hub_id' => 'AYMR',
            'flight_time_mins' => 0
        ];
    }
}
