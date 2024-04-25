<?php

namespace App\Services\Airports;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

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
        try {
            if (empty($this->apiKey) || empty($this->baseUrl)) {
                return [];
            }

            // check if metar exists in cache
            if (Cache::has($icao.'-metar')) {
                return Cache::get($icao.'-metar');
            }
            // get metar for icao
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey
            ])
                ->timeout(3)
                ->get($this->baseUrl.'/metar/'.$icao.'/decoded');

            // if no metar, get nearest
            if (!$response->json(['results']) == 1)
                $response = Http::withHeaders([
                    'X-API-KEY' => $this->apiKey
                ])
                    ->timeout(3)
                    ->get($this->baseUrl.'/metar/'.$icao.'/nearest/decoded');

            Cache::add($icao.'-metar', $response->json(['data']), 1800);
            return $response->json(['data']);
        } catch (ConnectionException $connectionException) {
            return [];
        }
    }
}
