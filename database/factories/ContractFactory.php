<?php

namespace Database\Factories;

use App\Models\Airport;
use App\Models\Contract;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContractFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Contract::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $arr = Airport::inRandomOrder()->first();
        $dest = $arr ? Airport::whereNot('id', $arr->id)->inRandomOrder()->first() : null;
        return [
            'dep_airport_id' => $ap->identifier ?? Airport::factory()->create()->identifier,
            'current_airport_id' => function (array $attributes) {
                return $attributes['dep_airport_id'];
            },
            'arr_airport_id' => $dest->identifier ?? Airport::factory()->create()->identifier,
            'contract_type_id' => 1,
            'distance' => 54,
            'heading' => 45,
            'payload' => 100,
            'contract_value' => 250,
            'cargo_type' => 1,
            'cargo' => 'Test',
            'cargo_qty' => 100,
            'expires_at' => Carbon::now()->addDays(5)
        ];
     }
}
