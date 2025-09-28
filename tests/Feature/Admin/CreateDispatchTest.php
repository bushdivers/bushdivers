<?php

namespace Tests\Feature\Admin;

use App\Models\Airport;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\CargoTypesSeeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CreateDispatchTest extends TestCase
{
    use RefreshDatabase;

    protected Airport $airport;
    protected Airport $destinationAirport;

    protected User $user;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->airport = Airport::factory()->create();
        $this->destinationAirport = Airport::factory()->create(['identifier' => 'DEST']);

        // Seed contract types if needed
        $this->seed(CargoTypesSeeder::class);

        // Create a user and an admin for testing
        $this->user = User::factory()->create()->fresh();
        $this->admin = User::factory()->create(['is_admin' => true])->fresh();
        $this->admin->roles()->save(Role::where('role', 'dispatcher')->first()); // Assign dispatcher role to admin

    }

    public function test_create_dispatch_page_accessible_to_admins()
    {
        $response = $this->actingAs($this->admin)->get(route('admin.dispatch.create'));
        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Admin/CreateContract')
        );
    }

    public function test_inaccessible_to_non_admins()
    {
        $response = $this->actingAs($this->user)->get(route('admin.dispatch.create'));
        $response->assertRedirect();
        $response->assertSessionHas('error');

        $response = $this->actingAs($this->user)->post(route('admin.dispatch.create'), [
            'source_airport_id' => $this->airport->identifier,
            'destination_airport_id' => $this->airport->identifier,
            'cargo_qty' => 100,
        ]);
        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    public function test_create_contract()
    {
        // Simulate form submission
        $response = $this->actingAs($this->admin)->post(route('admin.dispatch.create'), [
            'source_airport_id' => $this->airport->identifier,
            'destination_airport_id' => $this->destinationAirport->identifier,
            'cargo_qty' => 100,
        ]);

        $response->assertRedirect();
        $response->assertsessionHas('success');
        $this->assertDatabaseHas('contracts', [
            'dep_airport_id' => $this->airport->id,
            'arr_airport_id' => $this->destinationAirport->id,
            'cargo_qty' => 100,
        ]);
    }

    public function test_create_contract_with_invalid_data()
    {
        // Simulate form submission with invalid data
        $response = $this->actingAs($this->admin)->post(route('admin.dispatch.create'), [
            'source_airport_id' => '', // Invalid source airport
            'destination_airport_id' => $this->destinationAirport->identifier,
            'cargo_qty' => 100,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['source_airport_id']);

        $response = $this->actingAs($this->admin)->post(route('admin.dispatch.create'), [
            'source_airport_id' => $this->airport->identifier,
            'destination_airport_id' => '', // Invalid destination airport
            'cargo_qty' => 100,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['destination_airport_id']);

        $response = $this->actingAs($this->admin)->post(route('admin.dispatch.create'), [
            'source_airport_id' => $this->airport->identifier,
            'destination_airport_id' => $this->destinationAirport->identifier,
            'cargo_qty' => -50, // Invalid cargo quantity
        ]);
        $response->assertRedirect();
        $response->assertSessionHasErrors(['cargo_qty']);
    }
}