<?php

namespace Database\Factories;

use App\Models\AccountLedger;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 *  @extends Factory<AccountLedger>
 */
class AccountLedgerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = AccountLedger::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transaction_type' => 1,
            'total' => 0,
        ];
    }
}
