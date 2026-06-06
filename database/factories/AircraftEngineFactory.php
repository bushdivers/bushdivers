<?php

namespace Database\Factories;

use App\Models\AircraftEngine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 *  @extends Factory<AircraftEngine>
 */
class AircraftEngineFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = AircraftEngine::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'engine_no' => 1
        ];
    }
}
