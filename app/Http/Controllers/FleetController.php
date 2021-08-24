<?php

namespace App\Http\Controllers;

use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class FleetController extends Controller
{
    public function index(): Response
    {
        $fleet = Fleet::with('aircraft')->orderBy('type')->get();
        return Inertia::render('Fleet/FleetList', ['fleet' => $fleet]);
    }

    public function getAvailableAircraft(string $icao): JsonResponse
    {
        $aircraft = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->where('state', AircraftState::AVAILABLE)
            ->orderBy('fleet_id')
            ->get();
        return response()->json(['aircraft' => $aircraft]);
    }
}
