<?php

namespace Tests\Unit\Services\Weather;

use App\Services\Weather\CheckWxClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CheckWxClientTest extends TestCase
{
    use RefreshDatabase;
    protected CheckWxClient $client;

    public function setUp(): void
    {
        parent::setUp();

        Config::set('services.checkwx.key', 'test-api-key');
        Config::set('services.checkwx.url', 'https://example.com');

        $this->client = $this->app->make(CheckWxClient::class);
    }

    public function test_get_metars_by_icao_returns_keyed_array(): void
    {
        Http::fake([
            'https://example.com/metar/EGLL,EGWU/decoded' => Http::response([
                'results' => 2,
                'data' => [
                    ['icao' => 'EGLL', 'temp_c' => 15, 'wind' => '12010KT'],
                    ['icao' => 'EGWU', 'temp_c' => 12, 'wind' => '09005KT'],
                ],
            ]),
        ]);

        $result = $this->client->getMetarsByIcao(['EGLL', 'EGWU']);

        $this->assertNotNull($result);
        $this->assertCount(2, $result);
        $this->assertArrayHasKey('EGLL', $result);
        $this->assertArrayHasKey('EGWU', $result);
        $this->assertEquals(15, $result['EGLL']['temp_c']);
        $this->assertEquals(12, $result['EGWU']['temp_c']);
    }

    public function test_get_metars_by_icao_returns_empty_array_when_no_results(): void
    {
        Http::fake([
            'https://example.com/metar/FAKE/decoded' => Http::response([
                'results' => 0,
                'data' => [],
            ]),
        ]);

        $result = $this->client->getMetarsByIcao(['FAKE']);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function test_get_metars_by_icao_returns_null_on_empty_input(): void
    {
        $result = $this->client->getMetarsByIcao([]);

        $this->assertNull($result);
    }

    public function test_get_metars_by_icao_returns_null_on_failure(): void
    {
        Http::fake([
            'https://example.com/metar/EGLL/decoded' => Http::response(null, 500),
        ]);

        $result = $this->client->getMetarsByIcao(['EGLL']);

        $this->assertNull($result);
    }

    public function test_get_metars_by_icao_sets_failure_backoff(): void
    {
        Http::fake([
            'https://example.com/metar/EGLL/decoded' => Http::response(null, 500),
        ]);

        $this->client->getMetarsByIcao(['EGLL']);

        $this->assertTrue(Cache::has('checkwx_failure'));
    }

    public function test_get_metars_by_icao_returns_null_when_failure_backoff_active(): void
    {
        Cache::put('checkwx_failure', true, 300);

        Http::preventStrayRequests();

        $result = $this->client->getMetarsByIcao(['EGLL']);

        $this->assertNull($result);
    }

    public function test_get_metars_by_lat_lon_passes_limit_parameter(): void
    {
        Http::fake(function (\Illuminate\Http\Client\Request $request) {
            $this->assertStringContainsString('limit=3', $request->url());

            return Http::response([
                'results' => 2,
                'data' => [
                    ['icao' => 'EGLL', 'temp_c' => 15],
                    ['icao' => 'EGWU', 'temp_c' => 12],
                ],
            ]);
        });

        $result = $this->client->getMetarsByLatLon(51.5, -0.12, 3);

        $this->assertNotNull($result);
        $this->assertCount(2, $result);
        $this->assertArrayHasKey('EGLL', $result);
        $this->assertArrayHasKey('EGWU', $result);
    }

    public function test_get_metars_by_lat_lon_returns_empty_array_on_no_results(): void
    {
        Http::fake([
            'https://example.com/metar/lat/51.5/lon/-0.12/decoded*' => Http::response([
                'results' => 0,
                'data' => [],
            ]),
        ]);

        $result = $this->client->getMetarsByLatLon(51.5, -0.12);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function test_get_metars_by_lat_lon_returns_null_on_failure(): void
    {
        Http::fake([
            'https://example.com/metar/lat/51.5/lon/-0.12/decoded*' => Http::response(null, 500),
        ]);

        $result = $this->client->getMetarsByLatLon(51.5, -0.12);

        $this->assertNull($result);
    }

    public function test_get_metars_by_lat_lon_sets_failure_backoff(): void
    {
        Http::fake([
            'https://example.com/metar/lat/51.5/lon/-0.12/decoded*' => Http::response(null, 500),
        ]);

        $this->client->getMetarsByLatLon(51.5, -0.12);

        $this->assertTrue(Cache::has('checkwx_failure'));
    }

    public function test_get_metars_by_lat_lon_returns_null_when_failure_backoff_active(): void
    {
        Cache::put('checkwx_failure', true, 300);

        Http::preventStrayRequests();

        $result = $this->client->getMetarsByLatLon(51.5, -0.12);

        $this->assertNull($result);
    }

    public function test_failure_backoff_blocks_both_methods(): void
    {
        Cache::put('checkwx_failure', true, 300);

        Http::preventStrayRequests();

        $this->assertNull($this->client->getMetarsByIcao(['EGLL']));
        $this->assertNull($this->client->getMetarsByLatLon(51.5, -0.12));
    }
}
