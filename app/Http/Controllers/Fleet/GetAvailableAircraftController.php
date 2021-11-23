<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetAvailableAircraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $icao): JsonResponse
    {
        $aircraft = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->where('state', AircraftState::AVAILABLE)
            ->orderBy('fleet_id')
            ->get();
        return response()->json(['aircraft' => $aircraft]);
    }
}
