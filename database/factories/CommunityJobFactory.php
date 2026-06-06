<?php

namespace Database\Factories;

use App\Models\CommunityJob;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 *  @extends Factory<CommunityJob>
 */
class CommunityJobFactory extends Factory
{
    protected $model = CommunityJob::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->words(5, true),
            'is_published' => false,
            'is_completed' => false
        ];
    }
}
