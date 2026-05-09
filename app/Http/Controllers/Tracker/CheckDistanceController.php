<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Location\Coordinate;

class CheckDistanceController extends Controller
{
    public function __construct()
    { }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $start = new Coordinate($request->StartLat, $request->StartLon);
        $end = new Coordinate($request->EndLat, $request->EndLon);

        $distance = \App\Models\Concerns\HasLocation::distanceBetween($start, $end);

        return response()->json($distance);
    }
}
