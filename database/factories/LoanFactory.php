<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Loan>
 */
class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'loan_amount' => 1000,
            'total_interest' => 0,
            'total_remaining' => 1000,
            'term_months' => 10,
            'term_remaining' => 10,
            'monthly_payment' => 100,
            'missed_payments' => 0,
            'is_paid' => false
        ];
    }
}
