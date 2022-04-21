<?php

namespace Database\Factories;

use App\Models\ContractCargo;
use App\Models\Enums\ContractType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContractCargoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ContractCargo::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'cargo_type_id' => ContractType::Cargo,
            'current_airport_id' => 'AYMR',
            'cargo' => 'Test Cargo',
            'cargo_qty' => 300,
            'contract_value' => 250,
            'dep_airport_id' => 'AYMR',
            'arr_airport_id' => 'AYMN',
            'is_completed' => false
        ];
    }
}
