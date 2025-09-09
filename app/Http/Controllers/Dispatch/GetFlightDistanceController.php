<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\Airports\CalcDistanceBetweenPoints;
use App\Services\AirportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetFlightDistanceController extends Controller
{
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;

    public function __construct(CalcDistanceBetweenPoints $calcDistanceBetweenPoints)
    {
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $from, $to): JsonResponse
    {
        $dep = Airport::where('identifier', $from)->firstOrFail();
        $arr = Airport::where('identifier', $to)->firstOrFail();
        $distance = $this->calcDistanceBetweenPoints->execute($dep->lat, $dep->lon, $arr->lat, $arr->lon);

        return response()->json(['distance' => $distance]);
    }
}
