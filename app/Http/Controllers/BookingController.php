<?php

namespace App\Http\Controllers;

use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\Enums\AircraftState;
use App\Models\Pirep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{

    public function index(): Response
    {
        $bookings = Booking::with('flight', 'flight.depAirport', 'flight.arrAirport')
            ->where('user_id', Auth::user()->id)
            ->get();

        return Inertia::render('Flights/Bookings', ['bookings' => $bookings]);
    }

    public function create($flight): RedirectResponse
    {
        $booking = new Booking();
        $booking->user_id = Auth::user()->id;
        $booking->flight_id = $flight;
        $booking->save();

        return redirect()->back()->with(['success' => 'Booking created!']);
    }

    public function delete($flight): RedirectResponse
    {
        $booking = Booking::where('user_id', Auth::user()->id)
            ->where('flight_id', $flight)
            ->first();

        if ($booking->has_dispatch != '') {
            $pirep = Pirep::find($booking->has_dispatch);
            $aircraft = Aircraft::find($pirep->aircraft_id);
            $aircraft->state = AircraftState::AVAILABLE;
            $aircraft->save();
            $pirep->delete();
        }

        $booking->delete();

        return redirect()->back()->with(['success' => 'Booking cancelled!']);
    }
}
