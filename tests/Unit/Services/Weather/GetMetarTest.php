<?php

namespace Tests\Unit\Services\Weather;

use App\Models\Airport;
use App\Services\Weather\GetMetarForAirport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GetMetarTest extends TestCase
{
    use RefreshDatabase;

    protected GetMetarForAirport $getMetarForAirport;

    public function setUp(): void
    {
        parent::setUp();

        Config::set('services.checkwx.key', '12345');
        Config::set('services.checkwx.url', 'https://example.com');

        $this->getMetarForAirport = $this->app->make(GetMetarForAirport::class);
    }

    public function test_returns_cached_metars_for_airport_with_stored_stations(): void
    {
        $airport = Airport::factory()->create([
            'primary_metar' => 'EGLL',
            'secondary_metar' => 'EGWU',
            'metar_added_at' => now(),
        ]);

        Cache::put('metar:EGLL', ['icao' => 'EGLL', 'temp_c' => 15], 2700);
        Cache::put('metar:EGWU', ['icao' => 'EGWU', 'temp_c' => 12], 2700);

        Http::preventStrayRequests();

        $metars = $this->getMetarForAirport->execute($airport);

        $this->assertCount(2, $metars);
        $this->assertArrayHasKey('EGLL', $metars);
        $this->assertArrayHasKey('EGWU', $metars);
        $this->assertEquals(15, $metars['EGLL']['temp_c']);
        $this->assertEquals(12, $metars['EGWU']['temp_c']);
    }

    public function test_fetches_uncached_stations_via_icao_api(): void
    {
        $airport = Airport::factory()->create([
            'primary_metar' => 'EGLL',
            'secondary_metar' => 'EGWU',
            'metar_added_at' => now(),
        ]);

        Cache::put('metar:EGLL', ['icao' => 'EGLL', 'temp_c' => 15], 2700);

        Http::preventStrayRequests();
        Http::fake([
            'https://example.com/metar/EGWU/decoded' => Http::response([
                'results' => 1,
                'data' => [['icao' => 'EGWU', 'temp_c' => 12]],
            ]),
        ]);

        $metars = $this->getMetarForAirport->execute($airport);

        $this->assertCount(2, $metars);
        $this->assertEquals(15, $metars['EGLL']['temp_c']);
        $this->assertEquals(12, $metars['EGWU']['temp_c']);
    }

    public function test_returns_partial_cache_when_icao_api_fails(): void
    {
        $airport = Airport::factory()->create([
            'primary_metar' => 'EGLL',
            'secondary_metar' => 'EGWU',
            'metar_added_at' => now(),
        ]);

        Cache::put('metar:EGLL', ['icao' => 'EGLL', 'temp_c' => 15], 2700);

        Http::preventStrayRequests();
        Http::fake([
            'https://example.com/metar/EGWU/decoded' => Http::response(null, 500),
        ]);

        $metars = $this->getMetarForAirport->execute($airport);

        $this->assertCount(1, $metars);
        $this->assertArrayHasKey('EGLL', $metars);
    }

    public function test_finds_nearest_stations_for_uncached_airport(): void
    {
        $airport = Airport::factory()->create([
            'lat' => 51.5,
            'lon' => -0.12,
            'metar_added_at' => null,
            'primary_metar' => null,
            'secondary_metar' => null,
        ]);

        Http::preventStrayRequests();
        Http::fake([
            'https://example.com/metar/lat/51.5/lon/-0.12/decoded*' => Http::response([
                'results' => 2,
                'data' => [
                    ['icao' => 'EGLL', 'temp_c' => 15],
                    ['icao' => 'EGWU', 'temp_c' => 12],
                ],
            ]),
        ]);

        $metars = $this->getMetarForAirport->execute($airport);

        $this->assertCount(2, $metars);
        $this->assertArrayHasKey('EGLL', $metars);
        $this->assertArrayHasKey('EGWU', $metars);

        $airport->refresh();
        $this->assertEquals('EGLL', $airport->primary_metar);
        $this->assertEquals('EGWU', $airport->secondary_metar);
        $this->assertNotNull($airport->metar_added_at);
    }

    public function test_returns_empty_array_when_no_stations_found_for_uncached_airport(): void
    {
        $airport = Airport::factory()->create([
            'lat' => 51.5,
            'lon' => -0.12,
            'metar_added_at' => null,
        ]);

        Http::preventStrayRequests();
        Http::fake([
            'https://example.com/metar/lat/51.5/lon/-0.12/decoded*' => Http::response([
                'results' => 0,
                'data' => [],
            ]),
        ]);

        $metars = $this->getMetarForAirport->execute($airport);

        $this->assertEmpty($metars);
    }

    public function test_returns_empty_array_when_api_fails_for_uncached_airport(): void
    {
        $airport = Airport::factory()->create([
            'lat' => 51.5,
            'lon' => -0.12,
            'metar_added_at' => null,
        ]);

        Http::preventStrayRequests();
        Http::fake([
            'https://example.com/metar/lat/51.5/lon/-0.12/decoded*' => Http::response(null, 500),
        ]);

        $metars = $this->getMetarForAirport->execute($airport);

        $this->assertEmpty($metars);
    }
}
