<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\AirportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FlightController extends Controller
{
    protected AirportService $airportService;

    public function __construct(AirportService $airportService)
    {
        $this->airportService = $airportService;
    }

    public function getDistance($from, $to): JsonResponse
    {
        $dep = Airport::where('identifier', $from)->first();
        $arr = Airport::where('identifier', $to)->first();
        $distance = $this->airportService->calculateDistanceBetweenPoints($dep->lat, $dep->lon, $arr->lat, $arr->lon);

        return response()->json(['distance' => $distance]);
    }
}
