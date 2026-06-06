<?php

namespace Database\Factories;

use App\Models\TourCheckpoint;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 *  @extends Factory<TourCheckpoint>
 */
class TourCheckpointFactory extends Factory
{
    protected $model = TourCheckpoint::class;

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
