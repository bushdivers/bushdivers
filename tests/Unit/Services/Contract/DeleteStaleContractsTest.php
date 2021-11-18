<?php

namespace Tests\Unit\Services\Contract;

use App\Models\Contract;
use App\Services\ContractService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteStaleContractsTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_stale_contracts_are_removed()
    {
        $contract = Contract::factory()->create([
            'expires_at' => Carbon::now()->subDays(5),
            'user_id' => null,
            'is_available' => true,
            'is_completed' => false
        ]);

        $contractService = new ContractService();
        $contractService->removeStaleContracts();

        $this->assertDatabaseMissing('contracts', [
            'id' => $contract->id
        ]);
    }

    public function test_expired_contracts_with_a_user_are_not_removed()
    {
        $contract = Contract::factory()->create([
            'expires_at' => Carbon::now()->subDays(5),
            'user_id' => 1
        ]);

        $contractService = new ContractService();
        $contractService->removeStaleContracts();

        $this->assertDatabaseHas('contracts', [
            'id' => $contract->id
        ]);
    }

    public function test_current_contracts_are_not_removed()
    {
        $contract = Contract::factory()->create([
            'expires_at' => Carbon::now()->addDays(5)
        ]);

        $contractService = new ContractService();
        $contractService->removeStaleContracts();

        $this->assertDatabaseHas('contracts', [
            'id' => $contract->id
        ]);
    }
}
