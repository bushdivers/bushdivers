<?php

namespace Tests\Feature\Api\Dispatch;

use App\Models\Aircraft;
use App\Models\Enums\PirepState;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LiveFlightAPITest extends TestCase
{
    use RefreshDatabase;

    protected Pirep $pirep;
    protected Pirep $rentalPirep;

    protected function setUp(): void
    {
        parent::setUp();

        $pilot = User::factory()->create();

        $this->pirep = Pirep::factory()->create([
            'state' => PirepState::DISPATCH,
            'is_rental' => false,
            'user_id' => $pilot->id,
        ]);

        $rental = Rental::factory()->create(['user_id' => $pilot->id]);
        $this->rentalPirep = Pirep::factory()->create([
            'state' => PirepState::IN_PROGRESS,
            'is_rental' => true,
            'aircraft_id' => $rental->id,
            'user_id' => $pilot->id,
        ]);

        // Attach some flight logs to the in-progress rental pirep
        FlightLog::factory()->count(3)->create(['pirep_id' => $this->rentalPirep->id]);
    }

    // ─── /api/liveflights ────────────────────────────────────────────────────

    public function test_liveflights_includes_active_pireps(): void
    {
        $this->getJson('api/liveflights')
            ->assertOk()
            ->assertJsonFragment(['id' => $this->pirep->id])
            ->assertJsonFragment(['id' => $this->rentalPirep->id]);
    }

    public function test_liveflights_excludes_completed_pireps(): void
    {
        $completed = Pirep::factory()->create(['state' => PirepState::ACCEPTED]);

        $this->getJson('api/liveflights')
            ->assertOk()
            ->assertJsonMissing(['id' => $completed->id]);
    }

    public function test_liveflights_response_structure(): void
    {
        $this->getJson('api/liveflights')
            ->assertJsonStructure([
                'flights' => [
                    '*' => [
                        'id',
                        'status',
                        'current_lat',
                        'current_lon',
                        'current_heading',
                        'current_indicated_speed',
                        'pilot',
                        'dep_airport',
                        'arr_airport',
                    ],
                ],
            ]);
    }

    public function test_liveflights_rental_nonrental_fields(): void
    {
        $response = $this->getJson('api/liveflights')->json('flights');

        $rentalFlight = collect($response)->firstWhere('id', $this->rentalPirep->id);

        $this->assertNull($rentalFlight['aircraft']);
        $this->assertNotNull($rentalFlight['rental']);

        $flight = collect($response)->firstWhere('id', $this->pirep->id);

        $this->assertNull($flight['rental']);
        $this->assertNotNull($flight['aircraft']);
    }

    // ─── /api/whazzup ────────────────────────────────────────────────────────

    public function test_whazzup_returns_ivao_structure(): void
    {
        $this->getJson('api/whazzup')
            ->assertOk()
            ->assertJsonStructure([
                'clients' => [
                    'pilots',
                    'atcs',
                    'observers',
                ],
                'servers',
                'voiceServers',
                'connections',
            ]);
    }

    public function test_whazzup_includes_live_pireps(): void
    {
        $response = $this->getJson('api/whazzup');

        $pilots = $response->json('clients.pilots');

        $ids = collect($pilots)->pluck('id')->all();
        $this->assertContains((string) $this->pirep->id, $ids);
        $this->assertContains((string) $this->rentalPirep->id, $ids);
    }

    public function test_whazzup_excludes_completed_pireps(): void
    {
        $completed = Pirep::factory()->create(['state' => PirepState::ACCEPTED]);

        $pilots = $this->getJson('api/whazzup');
        $pilots->assertOk();

        $pilots = $pilots->json('clients.pilots');

        $this->assertNotContains($completed->id, collect($pilots)->pluck('id')->all());
    }
}