<?php

namespace Tests\Unit\Services\Financial;

use App\Services\Finance\CalculateAvailableLoans;
use Tests\TestCase;

class CalculateAvailableLoansTest extends TestCase
{
    protected CalculateAvailableLoans $calculateAvailableLoans;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculateAvailableLoans = $this->app->make(CalculateAvailableLoans::class);
    }

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_returns_loan_with_no_existing_loans_value()
    {
        $loan = $this->calculateAvailableLoans->execute(200, 200, 0, false);
        $this->assertEquals(1200, $loan);
    }

    public function test_returns_loan_value()
    {
        $loan = $this->calculateAvailableLoans->execute(200, 200, 100, false);
        $this->assertEquals(600, $loan);
    }

    public function test_returns_zero_for_negative_equity()
    {
        $loan = $this->calculateAvailableLoans->execute(200, 200, 500, false);
        $this->assertEquals(0, $loan);
    }

    public function test_returns_lower_value_due_to_default()
    {
        $loan = $this->calculateAvailableLoans->execute(200, 200, 100, true);
        $this->assertEquals(300, $loan);
    }
}
