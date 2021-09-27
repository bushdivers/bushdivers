<?php

namespace Database\Factories;

use App\Models\FlightLog;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlightLogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FlightLog::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'distance' => 0,
            'heading' => 0,
            'altitude' => 0,
            'indicated_speed' => 0,
            'ground_speed' => 0,
            'fuel_flow' => 0,
            'vs' => 0,
            'sim_time' => Carbon::now(),
            'zulu_time' => Carbon::now(),
        ];
    }
}
