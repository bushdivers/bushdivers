<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\AirportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AirportController extends Controller
{
    protected AirportService $airportService;

    public function __construct(AirportService $airportService)
    {
        $this->airportService = $airportService;
    }

    public function getCostOfJumpseat(string $from, string $to): JsonResponse
    {
        $jump = $this->airportService->getCostOfJumpseat($from, $to);
        return response()->json(['cost' => $jump['cost'], 'distance' => $jump['distance']]);
    }

    public function getAirportFromSearch(string $search): JsonResponse
    {
        $airport = Airport::where('identifier', $search)->first();
        return response()->json(['airport' => $airport]);
    }
}
