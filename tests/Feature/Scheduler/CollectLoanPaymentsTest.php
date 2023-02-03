<?php

namespace Tests\Feature\Scheduler;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollectLoanPaymentsTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_call_made_successfully()
    {
        $response = $this->withHeaders([
            'X-TOKEN' => env('SCHEDULER_TOKEN')
        ])->postJson('/api/schedule/finance/loans');
        $response->assertStatus(200);
        $this->assertDatabaseHas('schedule_logs', [
            'operation' => 'loan-collection',
            'is_success' => true
        ]);
    }
}
