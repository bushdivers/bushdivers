<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetFlightDistanceController extends Controller
{
    public function __construct()
    { }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $from, $to): JsonResponse
    {
        $dep = Airport::where('identifier', $from)->firstOrFail();
        $arr = Airport::where('identifier', $to)->firstOrFail();
        $distance = $dep->distanceTo($arr);

        return response()->json(['distance' => $distance]);
    }
}
