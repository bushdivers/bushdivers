<?php

namespace App\Services\Airports;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GetMetarForAirport
{
    private $apiKey = 'a12889c7844f470580dca7f41c';
    private $baseMetarUrl = 'https://api.checkwx.com/metar/';

    public function execute(string $icao): string
    {
        try {
            // check if metar exists in cache
            if (Cache::has($icao.'-metar')) {
                return Cache::get($icao.'-metar');
            }
            // get metar for icao
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey
            ])
                ->timeout(3)
                ->get($this->baseMetarUrl.$icao);


            if (!$response->json(['results']) == 1) {
                // if no metar, get nearest
                $response = Http::withHeaders([
                    'X-API-KEY' => $this->apiKey
                ])
                    ->timeout(3)
                    ->get($this->baseMetarUrl.$icao.'/nearest');
                return $this->returnMetarAsString($response->json(['data']), $icao);
            }

            return $this->returnMetarAsString($response->json(['data']), $icao);
        } catch (ConnectionException $connectionException) {
            return '';
        }
    }

    protected function returnMetarAsString($data, string $icao): string
    {
        $metar = implode($data);
        Cache::put($icao.'-metar', $metar, now()->addHours(2));
        return $metar;
    }
}
