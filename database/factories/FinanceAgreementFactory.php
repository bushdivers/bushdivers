<?php

namespace Database\Factories;

use App\Models\FinanceAgreement;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 *  @extends Factory<FinanceAgreement>
 */
class FinanceAgreementFactory extends Factory
{
    protected $model = FinanceAgreement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'finance_amount' => 1000,
            'term_months' => 10,
            'monthly_payments' => 100,
            'amount_remaining' => 1000,
            'term_remaining' => 10,
            'missed_payments' => 0,
            'is_paid' => false,
            'last_payment_at' => Carbon::now()
        ];
    }
}
