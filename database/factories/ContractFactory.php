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
        $ap = Airport::inRandomOrder()->first();
        $dest = $ap ? Airport::whereNot('id', $ap->id)->inRandomOrder()->first() : null;
        return [
            'dep_airport_id' => $ap->id ?? Airport::factory()->create()->id,
            'current_airport_id' => function (array $attributes) {
                return $attributes['dep_airport_id'];
            },
            'arr_airport_id' => $dest->id ?? Airport::factory()->create()->id,
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
