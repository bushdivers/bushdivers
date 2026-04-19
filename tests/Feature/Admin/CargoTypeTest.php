<?php

namespace Tests\Feature\Admin;

use App\Models\CargoType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CargoTypeTest extends TestCase
{
    use RefreshDatabase;

    protected User $dispatcher;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->dispatcher = User::factory()->create()->fresh();
        $this->dispatcher->roles()->save(Role::where('role', 'dispatcher')->first());

        $this->user = User::factory()->create()->fresh();
    }

    public function test_dispatcher_can_view_cargo_types_page(): void
    {
        CargoType::create(['text' => 'General Cargo', 'type' => 1]);

        $response = $this->actingAs($this->dispatcher)
            ->get(route('admin.cargo-types'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Admin/CargoTypes')
                ->has('cargoTypes', 1)
                ->where('cargoTypes.0.text', 'General Cargo')
                ->where('cargoTypes.0.type', 1)
                ->where('cargoTypes.0.min_cargo_split', 1)
        );
    }

    public function test_non_dispatcher_cannot_view_cargo_types_page(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('admin.cargo-types'));

        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    public function test_dispatcher_can_create_cargo_type(): void
    {
        $response = $this->actingAs($this->dispatcher)
            ->post(route('admin.cargo-types.store'), [
                'text' => 'Livestock',
                'type' => 1,
                'min_cargo_split' => 500,
            ]);

        $response->assertRedirect(route('admin.cargo-types'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('cargo_types', [
            'text' => 'Livestock',
            'type' => 1,
            'min_cargo_split' => 500,
        ]);
    }

    public function test_create_cargo_type_requires_valid_data(): void
    {
        $response = $this->actingAs($this->dispatcher)
            ->post(route('admin.cargo-types.store'), [
                'text' => '',
                'type' => 99,
                'min_cargo_split' => 0,
            ]);

        $response->assertSessionHasErrors(['text', 'type', 'min_cargo_split']);
    }

    public function test_dispatcher_can_update_cargo_type(): void
    {
        $cargoType = CargoType::create(['text' => 'Old Name', 'type' => 1]);

        $response = $this->actingAs($this->dispatcher)
            ->put(route('admin.cargo-types.update', $cargoType->id), [
                'text' => 'New Name',
                'type' => 2,
                'min_cargo_split' => 250,
            ]);

        $response->assertRedirect(route('admin.cargo-types'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('cargo_types', [
            'id' => $cargoType->id,
            'text' => 'New Name',
            'type' => 1,
            'min_cargo_split' => 250,
        ]);
    }

    public function test_dispatcher_can_delete_cargo_type(): void
    {
        $cargoType = CargoType::create(['text' => 'Unused Type', 'type' => 1]);

        $response = $this->actingAs($this->dispatcher)
            ->delete(route('admin.cargo-types.delete', $cargoType->id));

        $response->assertRedirect(route('admin.cargo-types'));
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('cargo_types', ['id' => $cargoType->id]);
    }
}
