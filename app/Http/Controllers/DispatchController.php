<?php

namespace App\Http\Controllers;

use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\ContractCargo;
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
        $userId = Auth::user()->id;
        // get contract bids for current location
//        $contracts = Contracts::with('cargo', 'depAirport', 'arrAirport', 'cargo.currentAirport')
//            ->where('is_completed', false)
//            ->where('user_id', Auth::user()->id)
//            ->whereHas('cargo', function ($q) use($currentLocation) {
//                $q->where('current_airport_id', $currentLocation)
//                    ->where('is_completed', false);
//            })->get();

        $cargo = ContractCargo::with('currentAirport', 'contract', 'contract.depAirport', 'contract.arrAirport')
            ->where('current_airport_id', $currentLocation)
            ->where('is_completed', false)
            ->whereHas('contract', function ($q) use($userId) {
                $q->where('user_id', $userId)
                    ->where('is_completed', false);
            })->get();

        // get aircraft available at current location
        $aircraft = Aircraft::with('fleet')
            ->where('state', AircraftState::AVAILABLE)
            ->where('status', AircraftStatus::ACTIVE)
            ->where('current_airport_id', $currentLocation)
            ->get();

        return Inertia::render('Dispatch/Dispatch', ['cargo' => $cargo, 'aircraft' => $aircraft]);
    }
}
