<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TourCheckpoint>
 */
class TourCheckpointFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section' => 1,
            'checkpoint_airport_id' => \App\Models\Airport::factory(),
        ];
    }
}
