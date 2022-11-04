<?php

namespace Services\Financial;

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
    public function test_returns_loan_value()
    {
        $loan = $this->calculateAvailableLoans->execute(200, 200, 100);
        $this->assertEquals(900, $loan);
    }

    public function test_returns_zero_for_negative_equity()
    {
        $loan = $this->calculateAvailableLoans->execute(200, 200, 500);
        $this->assertEquals(0, $loan);
    }
}
