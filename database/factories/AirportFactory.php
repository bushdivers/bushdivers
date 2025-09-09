<?php

namespace Database\Factories;

use App\Models\Airport;
use Illuminate\Database\Eloquent\Factories\Factory;

class AirportFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Airport::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'identifier' => $this->faker->unique()->bothify('??#??'),
            'name' => $this->faker->city . ' Airport',
            'country' => 'PG',
            'is_hub' => false,
            'is_thirdparty' => false,
            'lat' => $this->faker->latitude(-60, 60),
            'lon' => $this->faker->longitude(),
            'altitude' => $this->faker->numberBetween(0, 10000),
            'size' => 4,
            'has_avgas' => true,
            'has_jetfuel' => true,
            'avgas_qty' => $this->faker->numberBetween(0, 2000),
            'jetfuel_qty' => $this->faker->numberBetween(0, 2000),
        ];
    }

    public function noFuel(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'has_avgas' => false,
                'has_jetfuel' => false,
                'avgas_qty' => 0,
                'jetfuel_qty' => 0,
            ];
        });
    }

    public function hub(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'is_hub' => true,
            ];
        });
    }
}
