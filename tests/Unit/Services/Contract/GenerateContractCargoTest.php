<?php

namespace Tests\Unit\Services\Contract;

use App\Models\Enums\CargoType;
use App\Services\Contracts\GenerateContractCargo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class GenerateContractCargoTest extends TestCase
{
    use RefreshDatabase;

    protected GenerateContractCargo $generateContractCargo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->generateContractCargo = $this->app->make(GenerateContractCargo::class);
    }

    public function test_cargo_qty_is_multiple_of_min_cargo_split(): void
    {
        DB::table('cargo_types')->insert([
            ['type' => CargoType::Cargo->value, 'text' => 'Timber', 'min_cargo_split' => 500],
        ]);

        for ($i = 0; $i < 20; $i++) {
            $result = $this->generateContractCargo->execute();
            $this->assertEquals(0, $result['qty'] % 500, "qty {$result['qty']} is not a multiple of 500");
        }
    }

    public function test_passenger_qty_is_multiple_of_min_cargo_split(): void
    {
        DB::table('cargo_types')->insert([
            ['type' => CargoType::Passenger->value, 'text' => 'Workers', 'min_cargo_split' => 2],
        ]);

        for ($i = 0; $i < 20; $i++) {
            $result = $this->generateContractCargo->execute();
            $this->assertEquals(0, $result['qty'] % 2, "qty {$result['qty']} is not a multiple of 2");
            $this->assertGreaterThanOrEqual(2, $result['qty']);
        }
    }

    public function test_cargo_qty_is_not_rounded_when_min_split_is_one(): void
    {
        DB::table('cargo_types')->insert([
            ['type' => CargoType::Cargo->value, 'text' => 'Miscellaneous', 'min_cargo_split' => 1],
        ]);

        $result = $this->generateContractCargo->execute();
        $this->assertGreaterThan(0, $result['qty']);
    }
}
