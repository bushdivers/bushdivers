<?php

namespace Tests\Feature\Admin;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AircraftState;
use App\Models\Fleet;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RelocateMaintenanceTest extends TestCase
{
    use RefreshDatabase;

    protected User $fleetManager;
    protected User $regularUser;
    protected Aircraft $aircraft;
    protected Airport $sourceAirport;
    protected Airport $destinationAirport;

    protected function setUp(): void
    {
        parent::setUp();

        // Create airports
        $this->sourceAirport = Airport::factory()->create([
            'identifier' => 'KSRC',
            'lat' => 40.0,
            'lon' => -74.0
        ]);

        $this->destinationAirport = Airport::factory()->create([
            'identifier' => 'KDEST',
            'lat' => 42.0,
            'lon' => -71.0
        ]);

        // Create fleet and aircraft
        $fleet = Fleet::factory()->create();
        $this->aircraft = Aircraft::factory()->create([
            'fleet_id' => $fleet->id,
            'current_airport_id' => $this->sourceAirport->id,
            'state' => AircraftState::AVAILABLE,
            'last_lat' => $this->sourceAirport->lat,
            'last_lon' => $this->sourceAirport->lon
        ]);

        // Create users
        $this->regularUser = User::factory()->create();

        $this->fleetManager = User::factory()->create();
        $fleetManagerRole = Role::where('role', 'fleet_manager')->first();
        if (!$fleetManagerRole) {
            $fleetManagerRole = Role::factory()->create(['role' => 'fleet_manager']);
        }
        $this->fleetManager->roles()->attach($fleetManagerRole);
    }

    public function test_fleet_manager_can_relocate_available_aircraft()
    {
        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'aircraft' => $this->aircraft->id,
                'dest' => $this->destinationAirport->identifier
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('success');

        // Verify aircraft was relocated
        $this->aircraft->refresh();
        $this->assertEquals($this->destinationAirport->id, $this->aircraft->current_airport_id);
        $this->assertEquals($this->destinationAirport->lat, $this->aircraft->last_lat);
        $this->assertEquals($this->destinationAirport->lon, $this->aircraft->last_lon);
    }

    public function test_fleet_manager_can_relocate_with_lowercase_destination()
    {
        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'aircraft' => $this->aircraft->id,
                'dest' => strtolower($this->destinationAirport->identifier)
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('success');

        // Verify aircraft was relocated
        $this->aircraft->refresh();
        $this->assertEquals($this->destinationAirport->id, $this->aircraft->current_airport_id);
    }

    public function test_cannot_relocate_aircraft_in_use()
    {
        // First, verify the aircraft starts as available
        $this->assertEquals(AircraftState::AVAILABLE, $this->aircraft->state);

        // Update to in use using direct property assignment
        $this->aircraft->state = AircraftState::IN_USE;
        $this->aircraft->save();

        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'aircraft' => $this->aircraft->id,
                'dest' => $this->destinationAirport->identifier
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('error');

        // Verify aircraft was not relocated
        $this->aircraft->refresh();
        $this->assertEquals($this->sourceAirport->id, $this->aircraft->current_airport_id);
    }

    public function test_cannot_relocate_booked_aircraft()
    {
        // Update to booked using direct property assignment
        $this->aircraft->state = AircraftState::BOOKED;
        $this->aircraft->save();

        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'aircraft' => $this->aircraft->id,
                'dest' => $this->destinationAirport->identifier
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('error');

        // Verify aircraft was not relocated
        $this->aircraft->refresh();
        $this->assertEquals($this->sourceAirport->id, $this->aircraft->current_airport_id);
    }

    public function test_cannot_relocate_to_nonexistent_airport()
    {
        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'aircraft' => $this->aircraft->id,
                'dest' => 'KFAKE'
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('error');

        // Verify aircraft was not relocated
        $this->aircraft->refresh();
        $this->assertEquals($this->sourceAirport->id, $this->aircraft->current_airport_id);
    }

    public function test_cannot_relocate_nonexistent_aircraft()
    {
        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'aircraft' => 99999,
                'dest' => $this->destinationAirport->identifier
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('error');
    }

    public function test_regular_user_cannot_access_relocate_endpoint()
    {
        $response = $this->actingAs($this->regularUser)
            ->from('/some-page') // Set a referrer URL for redirect()->back()
            ->post(route('aircraft.relocate'), [
                'aircraft' => $this->aircraft->id,
                'dest' => $this->destinationAirport->identifier
            ]);

        // Should be redirected back with error due to role middleware
        $response->assertRedirect('/some-page');
        $response->assertSessionHas('error');
    }

    public function test_unauthenticated_user_cannot_access_relocate_endpoint()
    {
        $response = $this->post(route('aircraft.relocate'), [
            'aircraft' => $this->aircraft->id,
            'dest' => $this->destinationAirport->identifier
        ]);

        // Should redirect to login
        $response->assertRedirect(route('login.index'));
    }

    public function test_relocate_handles_missing_aircraft_parameter()
    {
        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'dest' => $this->destinationAirport->identifier
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('error');
    }

    public function test_relocate_handles_missing_destination_parameter()
    {
        $response = $this->actingAs($this->fleetManager)
            ->from('/some-page')
            ->post(route('aircraft.relocate'), [
                'aircraft' => $this->aircraft->id
            ]);

        $response->assertRedirect('/some-page');
        $response->assertSessionHas('error');
    }
}