<?php

namespace Tests\Feature\Admin;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateFerryControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Aircraft $aircraft;
    private User $pilot;
    private Airport $hub;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->pilot = User::factory()->create();
        $this->hub = Airport::factory()->create(['is_hub' => true]);
        $this->aircraft = Aircraft::factory()->atAirport($this->hub)->create([
            'is_ferry' => false,
            'ferry_user_id' => null,
        ]);
    }

    public function test_can_enable_ferry_with_pilot(): void
    {
        $this->actingAs($this->admin, 'web');

        $response = $this->post("/admin/aircraft/{$this->aircraft->id}/ferry", [
            'is_ferry' => true,
            'ferry_user_id' => $this->pilot->id,
        ]);

        $response->assertRedirect();
        $this->aircraft->refresh();
        $this->assertTrue($this->aircraft->is_ferry);
        $this->assertEquals($this->pilot->id, $this->aircraft->ferry_user_id);
    }

    public function test_can_disable_ferry(): void
    {
        $this->aircraft->update([
            'is_ferry' => true,
            'ferry_user_id' => $this->pilot->id,
        ]);

        $this->actingAs($this->admin, 'web');

        $response = $this->post("/admin/aircraft/{$this->aircraft->id}/ferry", [
            'is_ferry' => false,
            'ferry_user_id' => null,
        ]);

        $response->assertRedirect();
        $this->aircraft->refresh();
        $this->assertFalse($this->aircraft->is_ferry);
        $this->assertNull($this->aircraft->ferry_user_id);
    }

    public function test_cannot_update_ferry_with_active_dispatch_pirep(): void
    {
        Pirep::factory()->create([
            'aircraft_id' => $this->aircraft->id,
            'state' => PirepState::DISPATCH,
        ]);

        $this->actingAs($this->admin, 'web');

        $response = $this->post("/admin/aircraft/{$this->aircraft->id}/ferry", [
            'is_ferry' => true,
            'ferry_user_id' => $this->pilot->id,
        ]);

        $response->assertSessionHasErrors('aircraft');
        $this->aircraft->refresh();
        $this->assertFalse($this->aircraft->is_ferry);
    }

    public function test_cannot_update_ferry_with_active_in_progress_pirep(): void
    {
        Pirep::factory()->create([
            'aircraft_id' => $this->aircraft->id,
            'state' => PirepState::IN_PROGRESS,
        ]);

        $this->actingAs($this->admin, 'web');

        $response = $this->post("/admin/aircraft/{$this->aircraft->id}/ferry", [
            'is_ferry' => true,
            'ferry_user_id' => $this->pilot->id,
        ]);

        $response->assertSessionHasErrors('aircraft');
        $this->aircraft->refresh();
        $this->assertFalse($this->aircraft->is_ferry);
    }

    public function test_can_update_ferry_with_completed_pirep(): void
    {
        Pirep::factory()->create([
            'aircraft_id' => $this->aircraft->id,
            'state' => PirepState::ACCEPTED,
        ]);

        $this->actingAs($this->admin, 'web');

        $response = $this->post("/admin/aircraft/{$this->aircraft->id}/ferry", [
            'is_ferry' => true,
            'ferry_user_id' => $this->pilot->id,
        ]);

        $response->assertRedirect();
        $this->aircraft->refresh();
        $this->assertTrue($this->aircraft->is_ferry);
    }

    public function test_validates_pilot_id_exists(): void
    {
        $this->actingAs($this->admin, 'web');

        $response = $this->post("/admin/aircraft/{$this->aircraft->id}/ferry", [
            'is_ferry' => true,
            'ferry_user_id' => 99999,
        ]);

        $response->assertSessionHasErrors('ferry_user_id');
    }
}
