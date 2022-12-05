<?php

namespace Tests\Feature\Finance;

use App\Models\Enums\TransactionTypes;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ApplyForLoanTest extends TestCase
{
    use RefreshDatabase;

    protected Model $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_apply_for_loan_adds_loan()
    {
        $data = [
            'loanAmount' => 2000,
            'total' => 2200,
            'payment' => 220,
            'term' => 10,
            'interest' => 200
        ];
        $this->actingAs($this->user)->post('/loans', $data);
        $this->assertDatabaseHas('loans', [
            'user_id' => $this->user->id,
            'monthly_payment' => 220,
            'total_remaining' => $data['loanAmount'] + $data['interest'],
            'term_months' => 10
        ]);
    }

    public function test_apply_for_loan_adds_user_transaction()
    {
        $data = [
            'loanAmount' => 2000,
            'total' => 2200,
            'payment' => 220,
            'term' => 10,
            'interest' => 200
        ];
        $this->actingAs($this->user)->post('/loans', $data);
        $this->assertDatabaseHas('user_accounts', [
            'user_id' => $this->user->id,
            'total' => 2200,
            'type' => TransactionTypes::Loan
        ]);
    }
}
