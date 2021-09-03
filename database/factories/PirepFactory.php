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
            'flight_type' => FlightType::SCHEDULED,
            'cargo' => 100,
            'cargo_name' => 'test',
            'pax' => 0,
            'planned_cruise_altitude' => 5000
        ];
    }
}
