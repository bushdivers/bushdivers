<?php

namespace Tests\Feature\Aircraft;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateAircraftHubControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $owner;
    protected User $otherUser;
    protected User $fleetAdmin;
    protected Airport $originHub;
    protected Airport $newHub;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->otherUser = User::factory()->create();
        $this->fleetAdmin = User::factory()->create();

        $fleetAdminRole = Role::where('role', 'fleet_manager')->first();
        if (!$fleetAdminRole) {
            $fleetAdminRole = Role::factory()->create(['role' => 'fleet_manager']);
        }
        $this->fleetAdmin->roles()->attach($fleetAdminRole);

        $this->originHub = Airport::factory()->hub()->create(['identifier' => 'KAAA']);
        $this->newHub = Airport::factory()->hub()->create(['identifier' => 'KBBB']);
    }

    public function test_owner_can_update_private_aircraft_hub(): void
    {
        $aircraft = Aircraft::factory()->create([
            'owner_id' => $this->owner->id,
            'hub_id' => $this->originHub->id,
            'current_airport_id' => $this->originHub->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->from('/aircraft/' . $aircraft->id)
            ->post(route('aircraft.hub.update', ['aircraft' => $aircraft->id]), [
                'hub' => $this->newHub->identifier,
            ]);

        $response->assertRedirect('/aircraft/' . $aircraft->id);
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('aircraft', [
            'id' => $aircraft->id,
            'hub_id' => $this->newHub->id,
        ]);
    }

    public function test_non_owner_cannot_update_private_aircraft_hub(): void
    {
        $aircraft = Aircraft::factory()->create([
            'owner_id' => $this->owner->id,
            'hub_id' => $this->originHub->id,
            'current_airport_id' => $this->originHub->id,
        ]);

        $response = $this->actingAs($this->otherUser)
            ->from('/aircraft/' . $aircraft->id)
            ->post(route('aircraft.hub.update', ['aircraft' => $aircraft->id]), [
                'hub' => $this->newHub->identifier,
            ]);

        $response->assertRedirect('/aircraft/' . $aircraft->id);
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('aircraft', [
            'id' => $aircraft->id,
            'hub_id' => $this->originHub->id,
        ]);
    }

    public function test_regular_user_cannot_update_fleet_aircraft_hub(): void
    {
        $aircraft = Aircraft::factory()->create([
            'owner_id' => 0,
            'hub_id' => $this->originHub->id,
            'current_airport_id' => $this->originHub->id,
        ]);

        $response = $this->actingAs($this->otherUser)
            ->from('/aircraft/' . $aircraft->id)
            ->post(route('aircraft.hub.update', ['aircraft' => $aircraft->id]), [
                'hub' => $this->newHub->identifier,
            ]);

        $response->assertRedirect('/aircraft/' . $aircraft->id);
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('aircraft', [
            'id' => $aircraft->id,
            'hub_id' => $this->originHub->id,
        ]);
    }


    public function test_fleet_admin_cannot_update_private_aircraft_hub(): void
    {
        $aircraft = Aircraft::factory()->create([
            'owner_id' => $this->owner->id,
            'hub_id' => $this->originHub->id,
            'current_airport_id' => $this->originHub->id,
        ]);

        $response = $this->actingAs($this->fleetAdmin)
            ->from('/aircraft/' . $aircraft->id)
            ->post(route('aircraft.hub.update', ['aircraft' => $aircraft->id]), [
                'hub' => $this->newHub->identifier,
            ]);

        $response->assertRedirect('/aircraft/' . $aircraft->id);
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('aircraft', [
            'id' => $aircraft->id,
            'hub_id' => $this->originHub->id,
        ]);
    }


    public function test_fleet_admin_can_update_fleet_aircraft_hub(): void
    {
        $aircraft = Aircraft::factory()->create([
            'owner_id' => 0,
            'hub_id' => $this->originHub->id,
            'current_airport_id' => $this->originHub->id,
        ]);

        $response = $this->actingAs($this->fleetAdmin)
            ->from('/aircraft/' . $aircraft->id)
            ->post(route('aircraft.hub.update', ['aircraft' => $aircraft->id]), [
                'hub' => $this->newHub->identifier,
            ]);

        $response->assertRedirect('/aircraft/' . $aircraft->id);
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('aircraft', [
            'id' => $aircraft->id,
            'hub_id' => $this->newHub->id,
        ]);
    }

    public function test_hub_must_exist(): void
    {
        $aircraft = Aircraft::factory()->create([
            'owner_id' => $this->owner->id,
            'hub_id' => $this->originHub->id,
            'current_airport_id' => $this->originHub->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->from('/aircraft/' . $aircraft->id)
            ->post(route('aircraft.hub.update', ['aircraft' => $aircraft->id]), [
                'hub' => 'ZZZZ',
            ]);

        $response->assertRedirect('/aircraft/' . $aircraft->id);
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('aircraft', [
            'id' => $aircraft->id,
            'hub_id' => $this->originHub->id,
        ]);
    }
}
