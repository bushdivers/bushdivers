<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunityJobContract>
 */
class CommunityJobContractFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'dep_airport_id' => 'AYMR',
            'arr_airport_id' => 'AYMN',
            'cargo_type' => 1,
            'payload' => 100,
            'remaining_payload' => 100,
            'cargo' => fake()->words(1, true)
        ];
    }
}
