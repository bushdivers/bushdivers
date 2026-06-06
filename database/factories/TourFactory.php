<?php

namespace Database\Factories;

use App\Models\Tour;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 *  @extends Factory<Tour>
 */
class TourFactory extends Factory
{
    protected $model = Tour::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'is_published' => true,
            'start_airport_id' => \App\Models\Airport::factory(),
        ];
    }
}
