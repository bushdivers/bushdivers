<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class FinanceAgreementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
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
