<?php

namespace Tests\Feature\Dispatch;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\FuelType;
use App\Models\Enums\PirepState;
use App\Models\Fleet;
use App\Models\Pirep;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CancelDispatchTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $otherUser;
    protected Airport $origin;
    protected Airport $destination;
    protected Aircraft $aircraft;
    protected Fleet $fleet;
    protected Pirep $pirep;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test airports
        $this->origin = Airport::factory()->create([
            'identifier' => 'YSSY',
            'is_hub' => false,
        ]);

        $this->destination = Airport::factory()->create([
            'identifier' => 'YMML',
            'is_hub' => false,
        ]);

        // Create fleet and aircraft
        $this->fleet = Fleet::factory()->create([
            'fuel_type' => FuelType::AVGAS,
            'type' => 'C172',
        ]);

        $this->aircraft = Aircraft::factory()->create([
            'fleet_id' => $this->fleet->id,
            'registration' => 'VH-TEST',
            'current_airport_id' => $this->origin->id,
            'state' => AircraftState::AVAILABLE,
            'status' => AircraftStatus::ACTIVE,
        ]);

        // Create users
        $this->user = User::factory()->create([
            'current_airport_id' => $this->origin->id,
        ]);

        $this->otherUser = User::factory()->create([
            'current_airport_id' => $this->origin->id,
        ]);

        // Create a dispatch
        $this->pirep = Pirep::factory()->create([
            'user_id' => $this->user->id,
            'aircraft_id' => $this->aircraft->id,
            'departure_airport_id' => $this->origin->identifier,
            'destination_airport_id' => $this->destination->identifier,
            'state' => PirepState::DISPATCH,
        ]);
    }

    public function test_authentication_required_for_cancel_dispatch()
    {
        $response = $this->post(route('dispatch.cancel'), [
            'pirep' => $this->pirep->id
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_can_cancel_own_dispatch()
    {
        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), [
            'pirep' => $this->pirep->id
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Dispatch cancelled successfully');

        $this->assertDatabaseMissing('pireps', [
            'id' => $this->pirep->id
        ]);
    }

    public function test_cannot_cancel_nonexistent_pirep()
    {
        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), [
            'pirep' => 99999
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Flight already cancelled or no longer exists');
    }

    public function test_cannot_cancel_other_users_dispatch()
    {
        $response = $this->actingAs($this->otherUser)->post(route('dispatch.cancel'), [
            'pirep' => $this->pirep->id
        ]);

        $response->assertRedirect();

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('pireps', [
            'id' => $this->pirep->id
        ]);
    }

    public function test_cannot_cancel_accepted_pirep()
    {
        $this->pirep->state = PirepState::ACCEPTED;
        $this->pirep->save();

        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), [
            'pirep' => $this->pirep->id
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Flight already completed');

        // Verify PIREP still exists
        $this->assertDatabaseHas('pireps', [
            'id' => $this->pirep->id,
            'state' => PirepState::ACCEPTED
        ]);
    }

    public function test_cannot_cancel_rejected_pirep()
    {
        $this->pirep->state = PirepState::REJECTED;
        $this->pirep->save();

        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), [
            'pirep' => $this->pirep->id
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Flight already completed');

        // Verify PIREP still exists
        $this->assertDatabaseHas('pireps', [
            'id' => $this->pirep->id,
            'state' => PirepState::REJECTED
        ]);
    }

    public function test_can_cancel_in_progress_pirep()
    {
        $this->pirep->state = PirepState::IN_PROGRESS;
        $this->pirep->save();

        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), [
            'pirep' => $this->pirep->id
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Dispatch cancelled successfully');

        // Verify PIREP was deleted
        $this->assertDatabaseMissing('pireps', [
            'id' => $this->pirep->id
        ]);
    }

    public function test_cancel_dispatch_without_pirep_parameter()
    {
        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Flight already cancelled or no longer exists');
    }

    public function test_cancel_dispatch_with_empty_pirep_parameter()
    {
        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), [
            'pirep' => ''
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Flight already cancelled or no longer exists');
    }

    public function test_cancel_dispatch_with_null_pirep_parameter()
    {
        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), [
            'pirep' => null
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Flight already cancelled or no longer exists');
    }
}
