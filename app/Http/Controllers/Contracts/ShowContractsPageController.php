<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AircraftStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowContractsPageController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {

        $icao = Auth::user()->current_airport_id;

        $airport = Airport::where('identifier', $icao)->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
        }

        $aircraft = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->where('owner_id', 0)
            ->where('status', AircraftStatus::ACTIVE)
            ->get();

        return Inertia::render('Contracts/Contracts', ['airport' => $airport, 'aircraft' => $aircraft]);

    }
}
