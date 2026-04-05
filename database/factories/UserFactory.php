<?php

namespace Database\Factories;

use App\Models\Airport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => $this->faker->password(), // password
            'remember_token' => Str::random(10),

            'current_airport_id' => Airport::inRandomOrder()->first() ?: Airport::factory(),
            'allow_thirdparty_airport' => false,
            'allow_thirdparty_hub' => false,
            'allow_campsite_airport' => false,

            'toc_accepted' => true,
            'opt_in' => false,
            'points' => 0,
            'rank_id' => 1,
            'is_admin' => false,
            'loan' => 0.00
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
