<?php

namespace Tests\Feature\Admin;

use App\Models\Aircraft;
use App\Models\Enums\PirepState;
use App\Models\Fleet;
use App\Models\FleetVariant;
use App\Models\Pirep;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FleetVariantTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Fleet $fleet;
    protected FleetVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create()->refresh();
        $this->user->roles()->attach(Role::where('role', 'fleet_admin')->first());

        $this->fleet = Fleet::factory()->create();
        $this->variant = $this->fleet->variants()->first();
    }

    public function test_can_view_create_form()
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.fleet.variant.create', $this->fleet->id));

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($assert) => $assert
            ->component('Admin/FleetVariantEdit')
            ->where('variant', null)
        );
    }

    public function test_can_create_variant()
    {
        $response = $this->actingAs($this->user)->post(
            route('admin.fleet.variant.store', $this->fleet->id),
            [
                'name' => 'Float Version',
                'is_default' => false,
                'pax_capacity' => 5,
                'cargo_capacity' => 500,
                'fuel_capacity' => 180,
                'range' => 900,
                'mtow' => 2900,
                'zfw' => 2000,
            ]
        );

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('fleet_variants', [
            'fleet_id' => $this->fleet->id,
            'name' => 'Float Version',
            'pax_capacity' => 5,
        ]);
    }

    public function test_creating_default_variant_clears_other_defaults()
    {
        // Ensure the factory-created variant is the default
        $this->assertTrue($this->variant->is_default);

        $this->actingAs($this->user)->post(
            route('admin.fleet.variant.store', $this->fleet->id),
            [
                'name' => 'New Default',
                'is_default' => true,
                'pax_capacity' => 4,
                'cargo_capacity' => 400,
                'fuel_capacity' => 150,
                'range' => 800,
                'mtow' => 2700,
                'zfw' => 1900,
            ]
        );

        $this->assertDatabaseHas('fleet_variants', ['fleet_id' => $this->fleet->id, 'name' => 'New Default', 'is_default' => true]);
        $this->assertDatabaseHas('fleet_variants', ['id' => $this->variant->id, 'is_default' => false]);
    }

    public function test_can_update_variant()
    {
        $response = $this->actingAs($this->user)->post(
            route('admin.fleet.variant.update', [$this->fleet->id, $this->variant->id]),
            [
                'name' => 'Updated Name',
                'is_default' => true,
                'pax_capacity' => 8,
                'cargo_capacity' => 900,
                'fuel_capacity' => 210,
                'range' => 1300,
                'mtow' => 3200,
                'zfw' => 2100,
            ]
        );

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('fleet_variants', [
            'id' => $this->variant->id,
            'name' => 'Updated Name',
            'pax_capacity' => 8,
        ]);
    }

    public function test_can_delete_variant_when_multiple_exist()
    {
        $second = FleetVariant::factory()->create(['fleet_id' => $this->fleet->id, 'is_default' => false]);

        $response = $this->actingAs($this->user)
            ->get(route('admin.fleet.variant.delete', [$this->fleet->id, $second->id]));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('fleet_variants', ['id' => $second->id]);
    }

    public function test_cannot_delete_last_variant()
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.fleet.variant.delete', [$this->fleet->id, $this->variant->id]));

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('fleet_variants', ['id' => $this->variant->id]);
    }

    public function test_cannot_delete_variant_with_active_dispatch()
    {
        $second = FleetVariant::factory()->create(['fleet_id' => $this->fleet->id, 'is_default' => false]);

        $user = User::factory()->create();
        $aircraft = Aircraft::factory()->create(['fleet_id' => $this->fleet->id]);
        Pirep::factory()->create([
            'user_id' => $user->id,
            'aircraft_id' => $aircraft->id,
            'fleet_variant_id' => $second->id,
            'state' => PirepState::DISPATCH,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('admin.fleet.variant.delete', [$this->fleet->id, $second->id]));

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('fleet_variants', ['id' => $second->id]);
    }

}
