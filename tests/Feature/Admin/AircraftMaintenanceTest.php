<?php

namespace Tests\Feature\Admin;

use App\Models\AccountLedger;
use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Airport;
use App\Models\Enums\AircraftState;
use App\Models\Enums\MaintenanceCosts;
use App\Models\Enums\MaintenanceTypes;
use App\Models\Fleet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AircraftMaintenanceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Aircraft $fleetAircraft;   // owner_id = 0, uses airline balance
    protected Aircraft $ownedAircraft;   // owner_id = user, uses user balance
    protected Airport $hubAirport;
    protected Airport $smallAirport;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->hubAirport = Airport::factory()->create([
            'identifier' => 'YHUB',
            'is_hub' => true,
            'size' => 4,
        ]);

        $this->smallAirport = Airport::factory()->create([
            'identifier' => 'YSMALL',
            'is_hub' => false,
            'size' => 1,
        ]);

        $fleet = Fleet::factory()->create(['size' => 'S']);

        $this->fleetAircraft = Aircraft::factory()->create([
            'fleet_id' => $fleet->id,
            'owner_id' => 0,
            'wear' => 50,
            'current_airport_id' => $this->hubAirport->id,
        ]);

        $this->ownedAircraft = Aircraft::factory()->create([
            'fleet_id' => $fleet->id,
            'owner_id' => $this->user->id,
            'wear' => 50,
            'current_airport_id' => $this->hubAirport->id,
        ]);

        // Seed airline balance sufficient for maintenance
        AccountLedger::factory()->create(['total' => 100000]);
    }

    // -----------------------------------------------------------------------
    // Location guard
    // -----------------------------------------------------------------------

    public function test_cannot_perform_maintenance_at_small_non_hub_airport(): void
    {
        $this->fleetAircraft->update(['current_airport_id' => $this->smallAirport->id]);

        $response = $this->actingAs($this->user)->post(route('aircraft.maintenance'), [
            'aircraft' => $this->fleetAircraft->id,
            'type' => MaintenanceTypes::GeneralMaintenance,
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('aircraft', ['id' => $this->fleetAircraft->id, 'wear' => 50]);
    }

    // -----------------------------------------------------------------------
    // General maintenance (wear reset)
    // -----------------------------------------------------------------------

    public function test_general_maintenance_resets_fleet_aircraft_wear(): void
    {
        $response = $this->actingAs($this->user)->post(route('aircraft.maintenance'), [
            'aircraft' => $this->fleetAircraft->id,
            'type' => MaintenanceTypes::GeneralMaintenance,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('aircraft', ['id' => $this->fleetAircraft->id, 'wear' => 100]);
    }

    public function test_general_maintenance_resets_owned_aircraft_wear(): void
    {
        // Fund the user
        DB::table('user_accounts')->insert([
            'user_id' => $this->user->id,
            'type' => 1,
            'total' => 100000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->user)->post(route('aircraft.maintenance'), [
            'aircraft' => $this->ownedAircraft->id,
            'type' => MaintenanceTypes::GeneralMaintenance,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('aircraft', ['id' => $this->ownedAircraft->id, 'wear' => 100]);
    }

    // -----------------------------------------------------------------------
    // Engine maintenance (wear reset)
    // -----------------------------------------------------------------------

    public function test_engine_maintenance_resets_engine_wear(): void
    {
        $engine = AircraftEngine::factory()->create([
            'aircraft_id' => $this->fleetAircraft->id,
            'wear' => 40,
        ]);

        $response = $this->actingAs($this->user)->post(route('aircraft.maintenance'), [
            'aircraft' => $this->fleetAircraft->id,
            'type' => MaintenanceTypes::EngineMaintenance,
            'engine' => $engine->id,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('aircraft_engines', ['id' => $engine->id, 'wear' => 100]);
    }

    // -----------------------------------------------------------------------
    // Time-based maintenance (100hr / TBO clock reset)
    // -----------------------------------------------------------------------

    public function test_100hr_maintenance_resets_engine_times(): void
    {
        $engine = AircraftEngine::factory()->create([
            'aircraft_id' => $this->fleetAircraft->id,
            'mins_since_100hr' => 6500,
        ]);

        $response = $this->actingAs($this->user)->post(route('aircraft.maintenance'), [
            'aircraft' => $this->fleetAircraft->id,
            'type' => MaintenanceTypes::Maintenance100hr,
            'engine' => $engine->id,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('aircraft_engines', ['id' => $engine->id, 'mins_since_100hr' => 0]);
    }

    // -----------------------------------------------------------------------
    // Insufficient funds
    // -----------------------------------------------------------------------

    public function test_insufficient_airline_funds_blocked(): void
    {
        AccountLedger::query()->delete();
        AccountLedger::factory()->create(['total' => 1]); // less than CostGeneral (1000)

        $response = $this->actingAs($this->user)->post(route('aircraft.maintenance'), [
            'aircraft' => $this->fleetAircraft->id,
            'type' => MaintenanceTypes::GeneralMaintenance,
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('aircraft', ['id' => $this->fleetAircraft->id, 'wear' => 50]);
    }

    public function test_insufficient_user_funds_blocked(): void
    {
        // No user_accounts record = $0 balance
        $response = $this->actingAs($this->user)->post(route('aircraft.maintenance'), [
            'aircraft' => $this->ownedAircraft->id,
            'type' => MaintenanceTypes::GeneralMaintenance,
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('aircraft', ['id' => $this->ownedAircraft->id, 'wear' => 50]);
    }

    // -----------------------------------------------------------------------
    // Authentication
    // -----------------------------------------------------------------------

    public function test_authentication_required(): void
    {
        $response = $this->post(route('aircraft.maintenance'), [
            'aircraft' => $this->fleetAircraft->id,
            'type' => MaintenanceTypes::GeneralMaintenance,
        ]);

        $response->assertRedirectToRoute('login');
    }
}