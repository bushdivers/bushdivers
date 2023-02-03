<?php

namespace Tests\Feature\Scheduler;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProcessAirlineFeesTest extends TestCase
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
        ])->postJson('/api/schedule/finance/fees');
        $response->assertStatus(200);
        $this->assertDatabaseHas('schedule_logs', [
            'operation' => 'monthly-fees',
            'is_success' => true
        ]);
    }
}
