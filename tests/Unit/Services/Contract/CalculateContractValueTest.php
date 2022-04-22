<?php

namespace Tests\Unit\Services\Contract;

use App\Models\Enums\ContractValueTypes;
use App\Services\Contracts\CalcContractValue;
use Tests\TestCase;

class CalculateContractValueTest extends TestCase
{
    protected CalcContractValue $calcContractValue;

    protected function setUp(): void
    {
        parent::setUp(); // TODO: Change the autogenerated stub
        $this->calcContractValue = $this->app->make(CalcContractValue::class);
    }

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_value_of_cargo_contract()
    {
        $value = $this->calcContractValue->execute(1, 200, 100);
        $cargoPay = 200 * ContractValueTypes::CARGO_VALUE;
        $distancePay = (100/50) * ContractValueTypes::DISTANCE_VALUE;
        $expected = $cargoPay + $distancePay;
        $this->assertEquals($expected, $value);
    }

    public function test_value_of_pax_contract()
    {
        $value = $this->calcContractValue->execute(2, 8, 100);
        $cargoPay = 8 * ContractValueTypes::PAX_VALUE;
        $distancePay = (100/50) * ContractValueTypes::DISTANCE_VALUE;
        $expected = $cargoPay + $distancePay;
        $this->assertEquals($expected, $value);
    }
}
