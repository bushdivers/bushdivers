<?php

namespace App\Services\Weather;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CheckWxClient
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.checkwx.com/v2';

    protected const FAILURE_BACKOFF_SECONDS = 300; // 5 minutes

    public function __construct()
    {
        $this->apiKey = config('services.checkwx.key');
        $this->baseUrl = config('services.checkwx.url') ?? $this->baseUrl;
    }

    /**
     * Fetch METARs for up to 25 ICAOs in a single request.
     * @param array<string> $icaos
     * @return array<string, mixed>|null Keyed by ICAO, with decoded METAR data.
     */
    public function getMetarsByIcao(array $icaos): array|null
    {
        if (empty($icaos) || Cache::has('checkwx_failure')) {
            return null;
        }

        $icaoList = implode(',', array_unique($icaos));

        Log::info("Fetching METARs for ICAOs: {$icaoList}");

        return $this->sendRequest("metar/{$icaoList}/decoded");
    }

    /**
     * Find nearest active METAR stations for a Lat/Lon coordinate.
     * @param float $lat
     * @param float $lon
     * @param int $limit
     * @return array<string, mixed>|null Keyed by ICAO, with decoded METAR data.
     */
    public function getMetarsByLatLon(float $lat, float $lon, int $limit = 2): array|null
    {
        if (Cache::has('checkwx_failure')) {
            return null;
        }

        Log::info("Fetching METARs for coordinates: lat={$lat}, lon={$lon}");

        return $this->sendRequest("metar/lat/{$lat}/lon/{$lon}/decoded", [
            'limit' => $limit,
        ]);
    }

    protected function sendRequest(string $endpoint, array $queryParams = []): array|null
    {
        if (Cache::has('checkwx_failure')) {
            return null;
        }

        try {
            $response = Http::withHeaders(['X-API-Key' => $this->apiKey])
                ->get("{$this->baseUrl}/{$endpoint}", $queryParams);

            if ($response->failed()) {
                throw new \RuntimeException("CheckWX API request failed: {$response->status()} - {$response->body()}");
            }

            if ($response->json('results') === 0) {
                return [];
            }

            return collect($response->json('data', []))
                ->keyBy(fn ($item) => strtoupper($item['icao'] ?? ''))
                ->toArray();
        } catch (\Exception $e) {
            Cache::put('checkwx_failure', true, self::FAILURE_BACKOFF_SECONDS);

            Log::error('CheckWX API connection exception', [
                'endpoint' => $endpoint,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ]);
            return null;
        }
    }
}
