<?php

namespace Tests\Feature\Scheduler;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckForExpiredContractsTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $response = $this->withHeaders([
            'X-TOKEN' => env('SCHEDULER_TOKEN')
        ])->postJson('/api/schedule/contracts/clean');
        $response->assertStatus(200);
        $this->assertDatabaseHas('schedule_logs', [
            'operation' => 'check-expiry',
            'is_success' => true
        ]);
    }
}
