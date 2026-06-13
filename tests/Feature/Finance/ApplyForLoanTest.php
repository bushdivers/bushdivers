<?php

namespace Tests\Feature\Finance;

use App\Models\Enums\TransactionTypes;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApplyForLoanTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

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
    public function test_apply_for_loan_adds_loan(): void
    {
        $this->withExceptionHandling();
        $data = [
            'loanAmount' => 10,
            'transaction' => 'borrow'
        ];
        $this->actingAs($this->user)->post('/loans', $data);
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'loan' => 10
        ]);
    }

    public function test_repay_loan_removes_loan(): void
    {
        $user = User::factory()->create([
            'loan' => 500.00
        ]);
        $data = [
            'loanAmount' => 400.00,
            'transaction' => 'repayment'
        ];
        $this->actingAs($user)->post('/loans', $data);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'loan' => 100
        ]);
    }

    public function test_apply_for_loan_adds_user_transaction(): void
    {
        $data = [
            'loanAmount' => 2000,
            'transaction' => 'borrow'
        ];
        $this->actingAs($this->user)->post('/loans', $data);
        $this->assertDatabaseHas('user_accounts', [
            'user_id' => $this->user->id,
            'total' => 2000,
            'type' => TransactionTypes::Loan
        ]);
    }

    public function test_repay_loan_adds_user_transaction(): void
    {
        $user = User::factory()->create([
            'loan' => 500.00
        ]);
        $data = [
            'loanAmount' => 200.00,
            'transaction' => 'repay'
        ];
        $this->actingAs($user)->post('/loans', $data);
        $this->assertDatabaseHas('user_accounts', [
            'user_id' => $user->id,
            'total' => -200.00,
            'type' => TransactionTypes::Loan
        ]);
    }
}
