<?php

namespace Tests\Feature\MarketPlace;

use App\Models\Fleet;
use App\Models\Manufacturer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowMarketPlaceControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Manufacturer $manufacturer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->manufacturer = Manufacturer::factory()->create(['name' => 'Cessna']);
    }

    public function test_marketplace_index_renders_with_fleet_and_manufacturers(): void
    {
        $fleet = Fleet::factory()->create(['manufacturer_id' => $this->manufacturer->id]);

        $response = $this->actingAs($this->user)->get('/marketplace/user');

        $response->assertInertia(
            fn ($assert) => $assert
                ->component('Marketplace/Index')
                ->has('fleet', 1)
                ->has('manufacturers', 1)
                ->where('buyer', 'user')
        );
    }

    public function test_marketplace_index_eager_loads_manufacturer_and_default_variant(): void
    {
        Fleet::factory()->create(['manufacturer_id' => $this->manufacturer->id]);

        $response = $this->actingAs($this->user)->get('/marketplace/user');

        $response->assertInertia(
            fn ($assert) => $assert
                ->component('Marketplace/Index')
                ->has('fleet.0.manufacturer')
                ->has('fleet.0.default_variant')
        );
    }

    public function test_admin_buyer_returns_only_company_fleet(): void
    {
        Fleet::factory()->create([
            'manufacturer_id' => $this->manufacturer->id,
            'company_fleet' => true,
        ]);
        Fleet::factory()->create([
            'manufacturer_id' => $this->manufacturer->id,
            'company_fleet' => false,
        ]);

        $response = $this->actingAs($this->user)->get('/marketplace/admin');

        $response->assertInertia(
            fn ($assert) => $assert
                ->component('Marketplace/Index')
                ->has('fleet', 1)
                ->where('buyer', 'admin')
        );
    }

    public function test_user_buyer_returns_all_fleet(): void
    {
        Fleet::factory()->count(3)->create(['manufacturer_id' => $this->manufacturer->id]);

        $response = $this->actingAs($this->user)->get('/marketplace/user');

        $response->assertInertia(
            fn ($assert) => $assert
                ->component('Marketplace/Index')
                ->has('fleet', 3)
        );
    }

    public function test_fleet_without_variants_is_excluded(): void
    {
        // FleetFactory creates a default variant automatically, so we need
        // a fleet with no variants to test exclusion. We can delete the auto-created one.
        $fleet = Fleet::factory()->create(['manufacturer_id' => $this->manufacturer->id]);
        $fleet->variants()->delete();

        $response = $this->actingAs($this->user)->get('/marketplace/user');

        $response->assertInertia(
            fn ($assert) => $assert
                ->component('Marketplace/Index')
                ->has('fleet', 0)
        );
    }
}
