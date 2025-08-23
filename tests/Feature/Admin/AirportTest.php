<?php

namespace Tests\Feature\Admin;

use App\Models\Airport;
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

    public function test_airport_manager_can_view_third_party_airports_list()
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
        $response->assertInertia(fn ($assert) => $assert
            ->component('Admin/Airports')
            ->has('airports.data', 2)
            ->where('airports.data.0.identifier', 'TEST1')
            ->where('airports.data.1.identifier', 'TEST2')
        );
    }

    public function test_airport_manager_can_create_third_party_airport()
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

    public function test_airport_manager_can_update_third_party_airport()
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

    public function test_airport_manager_can_delete_third_party_airport()
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

    public function test_airport_manager_cannot_delete_regular_airport()
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

    public function test_validation_errors_for_required_fields()
    {
        $response = $this->actingAs($this->user)
            ->post('/admin/airports/create', []);

        $response->assertSessionHasErrors(['identifier', 'name', 'lat', 'lon']);
    }

    public function test_third_party_scope_works_correctly()
    {
        // Create airports with different is_thirdparty values
        Airport::factory()->create(['identifier' => 'TP01', 'is_thirdparty' => true]);
        Airport::factory()->create(['identifier' => 'REG01', 'is_thirdparty' => false]);
        Airport::factory()->create(['identifier' => 'TP02', 'is_thirdparty' => true]);

        $thirdPartyAirports = Airport::thirdParty()->get();

        $this->assertCount(2, $thirdPartyAirports);
        $this->assertTrue($thirdPartyAirports->contains('identifier', 'TP01'));
        $this->assertTrue($thirdPartyAirports->contains('identifier', 'TP02'));
        $this->assertFalse($thirdPartyAirports->contains('identifier', 'REG01'));
    }
}
