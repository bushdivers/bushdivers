<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\AirportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetFlightDistanceController extends Controller
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
    public function __invoke(Request $request, $from, $to): JsonResponse
    {
        $dep = Airport::where('identifier', $from)->first();
        $arr = Airport::where('identifier', $to)->first();
        $distance = $this->airportService->calculateDistanceBetweenPoints($dep->lat, $dep->lon, $arr->lat, $arr->lon);

        return response()->json(['distance' => $distance]);
    }
}
