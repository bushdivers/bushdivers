<?php

namespace Tests\Feature\Dispatch;

use App\Models\Pirep;
use App\Models\User;
use Database\Seeders\AirlineFeeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProcessManualPirepTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(AirlineFeeSeeder::class);
        $this->user = User::factory()->create();
    }

    public function test_can_submit(): void
    {
        $pirep = Pirep::factory()->inProgress()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this
            ->actingAs($this->user)
            ->postJson(route('pireps.process'), [
                'pirep_id' => $pirep->id,
                'fuel_used' => 30,
                'flight_time_mins' => 120,
                'distance' => 500,
            ]);

        $response->assertSessionHas('success');

    }

    public function test_fails_if_no_pirep(): void
    {
        $response = $this
            ->actingAs($this->user)
            ->postJson(route('pireps.process'), [
                'pirep_id' => null,
            ]);

        $response->assertStatus(422);

        Pirep::factory()->inProgress()->create([
            'user_id' => $this->user->id,
        ]); // Create a pirep to ensure the test is valid
        $response = $this
            ->actingAs($this->user)
            ->postJson(route('pireps.process'), [
                'pirep_id' => 99999,
            ]);
        $response->assertStatus(422);
    }

    public function test_fails_if_other_users_pirep(): void
    {
        $otherUser = User::factory()->create();
        $pirep = Pirep::factory()->inProgress()->create([
            'user_id' => $otherUser->id,
        ]);

        $response = $this
            ->actingAs($this->user)
            ->postJson(route('pireps.process'), [
                'pirep_id' => $pirep->id,
                'fuel_used' => 30,
                'flight_time_mins' => 120,
                'distance' => 500,
            ]);

        $response->assertSessionHas('error');
    }
}
