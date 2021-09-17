<?php

namespace Tests\Unit\Services\Pirep;

use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\Enums\AircraftState;
use App\Models\Fleet;
use App\Models\Flight;
use App\Models\Pirep;
use App\Models\User;
use App\Services\PirepService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class RemoveMultiplePirepsTest extends TestCase
{
    use RefreshDatabase;

    protected Model $user;
    protected Model $pirep;
    protected Model $flight;
    protected Model $booking;
    protected Model $fleet;
    protected Model $aircraft;
    protected PirepService $pirepService;

    protected function setUp(): void
    {

        parent::setUp(); // TODO: Change the autogenerated stub
        Artisan::call('db:seed --class=RankSeeder');
        $this->pirepService = new PirepService();
        $this->user = User::factory()->create([
            'rank_id' => 1
        ]);
        $this->fleet = Fleet::factory()->create();
        $this->aircraft = Aircraft::factory()->create([
            'fleet_id' => $this->fleet->id
        ]);
        $this->flight = Flight::factory()->create([
            'dep_airport_id' => 'EGLL',
            'arr_airport_id' => 'LFPG'
        ]);
        $this->booking = Booking::factory()->create([
            'user_id' => $this->user->id,
            'flight_id' => $this->flight->id,
        ]);
        $this->pirep = Pirep::factory()->create([
            'user_id' => $this->user->id,
            'flight_id' => $this->flight->id,
            'aircraft_id' => $this->aircraft->id,
            'booking_id' => $this->booking->id,
            'landing_rate' => 150,
            'distance' => 50,
            'flight_time' => 60
        ]);
    }
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_one_pirep_removed()
    {
        $this->pirepService->removeMultiplePireps($this->pirep);
        $this->assertDatabaseMissing('pireps', ['id' => $this->pirep->id]);
    }

    public function test_multiple_pireps_removed()
    {
        $aircraft = Aircraft::factory()->create([
            'fleet_id' => $this->fleet->id
        ]);

        $pirep = Pirep::factory()->create([
            'user_id' => $this->user->id,
            'flight_id' => $this->flight->id,
            'aircraft_id' => $aircraft->id,
            'booking_id' => $this->booking->id,
            'landing_rate' => 150,
            'distance' => 50,
            'flight_time' => 60
        ]);
        $pireps = collect([$pirep, $this->pirep]);
        $this->pirepService->removeMultiplePireps($pireps);
        $this->assertDatabaseMissing('pireps', ['id' => $this->pirep->id]);
        $this->assertDatabaseMissing('pireps', ['id' => $pirep->id]);
    }

    public function test_aircraft_updated()
    {
        $this->pirepService->removeMultiplePireps($this->pirep);
        $this->assertDatabaseHas('aircraft', ['id' => $this->pirep->aircraft_id, 'state' => AircraftState::AVAILABLE]);
    }
}
