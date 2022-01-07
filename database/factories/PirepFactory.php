<?php

namespace Database\Factories;

use App\Models\Enums\FlightType;
use App\Models\Pirep;
use Illuminate\Database\Eloquent\Factories\Factory;
use Ramsey\Uuid\Uuid;

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
            'id' => Uuid::uuid4(),
            'planned_fuel' => 50,
            'aircraft_id' => 1,
            'user_id' => 1,
            'destination_airport_id' => 'AYMN',
            'departure_airport_id' => 'AYMR',
            'is_rental' => false
        ];
    }
}
