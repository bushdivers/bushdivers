<?php

namespace App\Services\Weather;

use App\Models\Airport;
use Illuminate\Support\Facades\Cache;

class GetMetarForAirport
{
    protected const METAR_CACHE_DURATION = 2700; // 45 minutes

    public function __construct(
        protected CheckWxClient $checkWxClient
    ) {
    }


    /**
     * @param Airport $airport
     * @return array<array>|null
     */
    public function execute(Airport $airport): array|null
    {
        $icaoList = $this->getStations($airport);

        if (empty($icaoList)) {
            return [];
        }

        $metars = $this->fetchMetars($icaoList);

        return $metars;
    }

    /**
     * Get nearest metar for given airport
     * @param Airport $airport
     * @return array<mixed>|null
     */
    public function getPrimaryMetar(Airport $airport): array|null
    {
        $icaoList = $this->getStations($airport);

        if (empty($icaoList)) {
            return null;
        }

        $metars = $this->fetchMetars($icaoList);
        $metars = $metars[$airport->primary_metar] ?? null;
        if ($metars !== null && $airport->identifier !== $airport->primary_metar) {
            if ($primary = Airport::where('identifier', $airport->primary_metar)->first()) {
                $metars['distance'] = $airport->distanceTo($primary);
                $metars['bearing'] = $airport->bearingTo($primary);
            }
        }

        return $metars;
    }

    /**
     * Get nearest metar ICAOs for given airport
     * @param Airport $airport
     * @return array<string> ICAO list
     */
    protected function getStations(Airport $airport): array
    {
        if (!empty($airport->metar_added_at)) {
            return array_filter([$airport->primary_metar, $airport->secondary_metar]);
        }

        $nearest = $this->checkWxClient->getMetarsByLatLon((float)$airport->lat, (float)$airport->lon, 2);
        if ($nearest === null) {
            return [];
        }

        // Store nearest back to database for caching purposes
        $icaos = array_keys($nearest);
        $airport->update([
            'primary_metar' => $icaos[0] ?? null,
            'secondary_metar' => $icaos[1] ?? null,
            'metar_added_at' => now()
        ]);

        // Since we have metar, store it
        foreach ($icaos as $icao) {
            Cache::put("metar:{$icao}", $nearest[$icao] ?? null, self::METAR_CACHE_DURATION);
        }

        return $icaos;
    }

    protected function fetchMetars(array $icaoList): array
    {
        $missing = [];
        $results = [];

        foreach ($icaoList as $icao) {
            $cached = Cache::get("metar:{$icao}");
            if ($cached !== null) {
                $results[$icao] = $cached;
            } else {
                $missing[] = $icao;
            }
        }

        if (!empty($missing)) {
            $metars = $this->checkWxClient->getMetarsByIcao($missing);
            if ($metars === null) {
                // If API failed, return what we have in cache
                return $results;
            }

            foreach ($metars as $icao => $metar) {
                Cache::put("metar:{$icao}", $metar, self::METAR_CACHE_DURATION);
                $results[$icao] = $metar;
            }
        }

        return $results;
    }

}
