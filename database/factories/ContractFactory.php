<?php

namespace Database\Factories;

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
        return [
            'dep_airport_id' => 'AYMR',
            'arr_airport_id' => 'AYMN',
            'contract_type_id' => 1,
            'distance' => 54,
            'heading' => 45,
            'contract_value' => 250,
            'expires_at' => Carbon::now()->addDays(5)
        ];
     }
}
