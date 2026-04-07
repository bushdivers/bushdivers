<?php

namespace Database\Factories;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PirepFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pirep::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => $this->faker->uuid(),
            'planned_fuel' => 50,
            'aircraft_id' => Aircraft::factory(),
            'user_id' => User::factory(),
            'arrival_airport_id' => Airport::factory(),
            'departure_airport_id' => Airport::factory(),
            'is_rental' => false
        ];
    }

    public function inProgress(): static
    {
        return static::state(fn () =>  [
            'state' => PirepState::IN_PROGRESS,
        ]);
    }

    public function complete(): static
    {
        return static::state(fn () =>  [
            'state' => PirepState::ACCEPTED,
            'fuel_used' => $this->faker->numberBetween(20, 50),
            'flight_time' => $this->faker->numberBetween(30, 180),
            'distance' => $this->faker->numberBetween(100, 1000),
        ]);
    }
}
