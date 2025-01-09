<?php

namespace App\Services\Airports;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GetMetarForAirport
{
    private $apiKey;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.checkwx.key');
        $this->baseUrl = config('services.checkwx.url');
    }

    public function execute(string $icao): array|string
    {
        if (empty($this->apiKey) || empty($this->baseUrl)) {
            return [];
        }

        // get metar from cache
        // on error, stores empty array
        $metar = Cache::remember(
            $icao . '-metar',
            1800,
            function () use ($icao) {
                try {
                    // get metar for icao
                    $response = Http::withHeaders([
                        'X-API-KEY' => $this->apiKey
                    ])
                        ->timeout(15)
                        ->get($this->baseUrl . '/metar/' . $icao . '/decoded');

                    // if no metar, get nearest
                    if (!$response->json('results') == 1)
                        $response = Http::withHeaders([
                            'X-API-KEY' => $this->apiKey
                        ])
                            ->timeout(3)
                            ->get($this->baseUrl . '/metar/' . $icao . '/nearest/decoded');

                    return ['data'=>$response->json('data.0')];
                } catch (Throwable $e) {
                    Log::error('Error getting METAR for ' . $icao . ': ' . $e->getMessage());
                }
                // Force error to store empty array
                return ['data'=>[]];
            }
        );


        // Unmap data from cache, since cache won't store a direct empty array
        return $metar['data'] ?? [];
    }
}
