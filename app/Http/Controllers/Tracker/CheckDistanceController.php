<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Services\AirportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckDistanceController extends Controller
{
    protected AirportService $airportService;

    public function __construct(AirportService $airportService)
    {
        $this->airportService = $airportService;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $distance = $this->airportService->calculateDistanceBetweenPoints(
            $request->StartLat,
            $request->StartLon,
            $request->EndLat,
            $request->EndLon,
            true
        );

        return response()->json($distance);
    }
}
