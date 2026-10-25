<?php

namespace Tests\Feature\Admin;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Pirep;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AirportTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user with airport_manager role for testing
        $this->user = User::factory()->create()->refresh();

        $this->user->roles()->attach(Role::where('role', 'airport_manager')->first());

    }

    public function test_airport_manager_can_view_third_party_airports_list(): void
    {
        // Create some third-party airports
        Airport::factory()->create([
            'identifier' => 'TEST1',
            'name' => 'Test Airport 1',
            'is_thirdparty' => true,
        ]);

        Airport::factory()->create([
            'identifier' => 'TEST2',
            'name' => 'Test Airport 2',
            'is_thirdparty' => true,
        ]);

        // Create a regular airport (should not appear in third-party list)
        Airport::factory()->create([
            'identifier' => 'REG01',
            'name' => 'Regular Airport',
            'is_thirdparty' => false,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/admin/airports');

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($assert) => $assert
            ->component('Admin/Airports')
            ->has('airports.data', 2)
            ->where('airports.data.0.identifier', 'TEST1')
            ->where('airports.data.1.identifier', 'TEST2')
        );
    }

    public function test_airport_manager_can_create_third_party_airport(): void
    {
        $airportData = [
            'identifier' => 'NEW01',
            'name' => 'New Test Airport',
            'location' => 'Test Location',
            'country' => 'Test Country',
            'lat' => 45.123456,
            'lon' => -123.654321,
            'magnetic_variance' => 12.5,
            'altitude' => 1500,
            'size' => 3,
            'longest_runway_length' => 5000,
            'longest_runway_width' => 150,
            'longest_runway_surface' => 'Asphalt',
            'has_avgas' => true,
            'has_jetfuel' => false,
        ];

        $response = $this->actingAs($this->user)
            ->post('/admin/airports/create', $airportData);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('success', 'Third-party airport created successfully.');

        $this->assertDatabaseHas('airports', [
            'identifier' => 'NEW01',
            'name' => 'New Test Airport',
            'is_thirdparty' => true,
        ]);
    }

    public function test_airport_manager_can_update_third_party_airport(): void
    {
        $airport = Airport::factory()->create([
            'identifier' => 'UPD01',
            'name' => 'Airport to Update',
            'is_thirdparty' => true,
        ]);

        $updateData = [
            'identifier' => 'UPD01',
            'name' => 'Updated Airport Name',
            'location' => 'Updated Location',
            'country' => 'Updated Country',
            'lat' => 50.123456,
            'lon' => -120.654321,
            'magnetic_variance' => 15.0,
            'altitude' => 2000,
            'size' => 4,
            'longest_runway_length' => 6000,
            'longest_runway_width' => 200,
            'longest_runway_surface' => 'Concrete',
            'has_avgas' => false,
            'has_jetfuel' => true,
        ];

        $response = $this->actingAs($this->user)
            ->post("/admin/airports/edit/{$airport->id}", $updateData);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('success', 'Third-party airport updated successfully.');

        $this->assertDatabaseHas('airports', [
            'id' => $airport->id,
            'name' => 'Updated Airport Name',
            'location' => 'Updated Location',
        ]);
    }

    public function test_airport_manager_can_delete_third_party_airport(): void
    {
        $airport = Airport::factory()->create([
            'identifier' => 'DEL01',
            'name' => 'Airport to Delete',
            'is_thirdparty' => true,
        ]);

        $response = $this->actingAs($this->user)
            ->delete("/admin/airports/{$airport->id}");

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('success', 'Third-party airport deleted successfully.');

        $this->assertDatabaseMissing('airports', [
            'id' => $airport->id,
        ]);
    }

    public function test_airport_manager_cannot_delete_regular_airport(): void
    {
        $airport = Airport::factory()->create([
            'identifier' => 'REG01',
            'name' => 'Regular Airport',
            'is_thirdparty' => false,
        ]);

        $response = $this->actingAs($this->user)
            ->delete("/admin/airports/{$airport->id}");

        $response->assertNotFound();

        $this->assertDatabaseHas('airports', [
            'id' => $airport->id,
        ]);
    }

    public function test_validation_errors_for_required_fields(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/admin/airports/create', []);

        $response->assertSessionHasErrors(['identifier', 'name', 'lat', 'lon']);
    }

    public function test_base_airport_search_returns_nearest_five_open_base_airports(): void
    {
        Airport::factory()->create(['identifier' => 'AAAA', 'lat' => 0, 'lon' => 0]);
        foreach (range(1, 6) as $i) {
            Airport::factory()->create(['identifier' => "N{$i}", 'lat' => $i * 0.1, 'lon' => 0]);
        }
        Airport::factory()->create(['identifier' => 'CLSD', 'lat' => 0.05, 'lon' => 0, 'closed' => true]);
        Airport::factory()->create(['identifier' => 'TPTY', 'lat' => 0.06, 'lon' => 0, 'is_thirdparty' => true]);

        $this->actingAs($this->user)
            ->getJson('/admin/airports/base?icao=aaaa')
            ->assertOk()
            ->assertJsonPath('identifier', 'AAAA')
            ->assertJsonCount(5, 'nearest')
            ->assertJsonPath('nearest.0.identifier', 'N1')
            ->assertJsonPath('nearest.4.identifier', 'N5');
    }

    public function test_base_airport_search_rejects_hubs_and_third_party(): void
    {
        Airport::factory()->create(['identifier' => 'HUB1', 'is_hub' => true]);
        Airport::factory()->create(['identifier' => 'TPTY', 'is_thirdparty' => true]);

        foreach (['HUB1' => 422, 'TPTY' => 422, 'NOPE' => 404] as $icao => $status) {
            $this->actingAs($this->user)
                ->getJson("/admin/airports/base?icao={$icao}")
                ->assertStatus($status)
                ->assertJsonStructure(['error']);
        }
    }

    public function test_closing_airport_with_aircraft_requires_target(): void
    {
        $airport = Airport::factory()->create(['identifier' => 'AAAA']);
        Aircraft::factory()->atAirport($airport)->create();

        $this->actingAs($this->user)
            ->post('/admin/airports/base/edit', ['icao' => 'AAAA', 'closed' => true])
            ->assertSessionHasErrors('reassign_to');

        $this->assertFalse($airport->fresh()->closed);
    }

    public function test_closing_airport_moves_aircraft_to_target(): void
    {
        $airport = Airport::factory()->create(['identifier' => 'AAAA']);
        $target = Airport::factory()->create(['identifier' => 'BBBB']);
        $aircraft = Aircraft::factory()->atAirport($airport)->create();

        $this->actingAs($this->user)
            ->post('/admin/airports/base/edit', ['icao' => 'AAAA', 'reassign_to' => $target->id, 'closed' => true])
            ->assertSessionHasNoErrors();

        $this->assertTrue($airport->fresh()->closed);
        $this->assertEquals($target->id, $aircraft->fresh()->current_airport_id);
        $this->assertEquals($target->id, $aircraft->fresh()->hub_id);
    }

    public function test_closed_airport_can_be_reopened(): void
    {
        $airport = Airport::factory()->create(['identifier' => 'AAAA', 'closed' => true]);

        $this->actingAs($this->user)
            ->post('/admin/airports/base/edit', ['icao' => 'AAAA', 'closed' => false])
            ->assertSessionHasNoErrors();

        $this->assertFalse($airport->fresh()->closed);
    }

    public function test_toggle_rejects_hub_airports(): void
    {
        Airport::factory()->create(['identifier' => 'HUB1', 'is_hub' => true]);

        $this->actingAs($this->user)
            ->post('/admin/airports/base/edit', ['icao' => 'HUB1', 'closed' => true])
            ->assertSessionHasErrors('icao');
    }

    public function test_closing_airport_blocked_by_user(): void
    {
        $airport = Airport::factory()->create(['identifier' => 'AAAA']);
        $target = Airport::factory()->create(['identifier' => 'BBBB']);
        User::factory()->create(['current_airport_id' => $airport->id]);

        $this->actingAs($this->user)
            ->post('/admin/airports/base/edit', ['icao' => 'AAAA', 'reassign_to' => $target->id, 'closed' => true])
            ->assertSessionHas('error');

        $this->assertFalse($airport->fresh()->closed);
    }

    public function test_closing_airport_blocked_blocked_by_pirep(): void
    {
        $airport = Airport::factory()->create(['identifier' => 'AAAA']);
        $target = Airport::factory()->create(['identifier' => 'BBBB']);
        Pirep::factory()->inProgress()->create(['arrival_airport_id' => $airport->id]);

        $this->actingAs($this->user)
            ->post('/admin/airports/base/edit', ['icao' => 'AAAA', 'reassign_to' => $target->id, 'closed' => true])
            ->assertSessionHas('error');

        $this->assertFalse($airport->fresh()->closed);
    }
}
