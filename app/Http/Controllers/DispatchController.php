<?php

namespace App\Http\Controllers;

use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DispatchController extends Controller
{
    public function index(): Response
    {
        $currentLocation = Auth::user()->current_airport_id;
        // get bookings for current location
        $bookings = Booking::with(['contract', 'contract.depAirport', 'contract.arrAirport', 'contract.currentAirport' => function ($q) use($currentLocation) {
            $q->where('identifier', $currentLocation);
        }])
            ->where('is_completed', false)
            ->get();

        // get aircraft available at current location
        $aircraft = Aircraft::with('fleet')
            ->where('state', AircraftState::AVAILABLE)
            ->where('status', AircraftStatus::ACTIVE)
            ->where('current_airport_id', $currentLocation)
            ->get();

        return Inertia::render('Dispatch/Dispatch', ['bookings' => $bookings, 'aircraft' => $aircraft]);
    }
}
