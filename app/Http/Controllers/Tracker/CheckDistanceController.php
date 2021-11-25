<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckDistanceController extends Controller
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
    public function __invoke(Request $request): JsonResponse
    {
        $distance = $this->calcDistanceBetweenPoints->execute(
            $request->StartLat,
            $request->StartLon,
            $request->EndLat,
            $request->EndLon,
            true
        );

        return response()->json($distance);
    }
}
