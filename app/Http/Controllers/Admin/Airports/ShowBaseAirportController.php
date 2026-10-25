<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Rental;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShowBaseAirportController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $icao = strtoupper(trim((string) $request->query('icao')));

        $airport = Airport::query()->where('identifier', $icao)->first();

        if (!$airport) {
            return response()->json(['error' => 'Airport not found'], 404);
        }

        if ($airport->is_thirdparty || $airport->is_hub) {
            return response()->json(['error' => 'Third-party airports and hubs cannot be edited here'], 422);
        }

        $nearest = [];
        if (!$airport->closed) {
            $nearest = Airport::query()
                ->withRangeTo($airport)
                ->where('is_thirdparty', false)
                ->where('closed', false)
                ->whereNull('user_id')
                ->whereKeyNot($airport->id)
                ->orderBy('distance')
                ->limit(5)
                ->get()
                ->map(fn (Airport $a) => [
                    'id' => $a->id,
                    'identifier' => $a->identifier,
                    'name' => $a->name,
                    'size' => $a->size,
                    'distance' => round((float) $a->distance),
                ])
                ->all();
        }

        return response()->json([
            'id' => $airport->id,
            'identifier' => $airport->identifier,
            'name' => $airport->name,
            'size' => $airport->size,
            'closed' => $airport->closed,
            'current_aircraft_count' => Aircraft::query()->where('current_airport_id', $airport->id)->count() + Rental::query()->where('current_airport_id', $airport->id)->count(),
            'home_aircraft_count' => Aircraft::query()->where('hub_id', $airport->id)->count(),
            'nearest' => $nearest,
        ]);
    }
}
