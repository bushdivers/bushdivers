<?php

namespace Tests\Feature\Airport;

use App\Models\Airport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class ShowAirportTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.checkwx.key', 'test-key');
        Config::set('services.checkwx.url', 'https://example.com');

        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_open(): void
    {
        $hub = Airport::factory()->hub()->create(['identifier' => 'TEST2']);
        Airport::factory()->nearby($hub)->create(['identifier' => 'TEST']);
        Airport::factory()->nearby($hub)->count(5)->create();

        $response = $this->get(route('airport', ['icao' => 'TEST']));

        $response
            ->assertOk()
            ->assertInertia(
                fn ($page) =>
                    $page->where('airport.identifier', 'TEST')
                        ->has('aircraft')
                        ->has('contracts')
            );
    }

    public function test_fails_if_not_found(): void
    {
        $response = $this->get(route('airport'));
        $response->assertSessionHas('error');

        $response = $this->get(route('airport', ['icao' => 'NOTEXIST']));
        $response->assertSessionHas('error');
    }
}
