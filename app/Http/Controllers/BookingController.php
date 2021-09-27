<?php

namespace App\Http\Controllers;

use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\Contract;
use App\Models\Enums\AircraftState;
use App\Models\Pirep;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{

    public function index(): Response
    {
        $bookings = Booking::with('contract', 'contract.depAirport', 'contract.currentAirport', 'contract.arrAirport')
            ->where('user_id', Auth::user()->id)
            ->get();

        return Inertia::render('Flights/Bookings', ['bookings' => $bookings]);
    }

    public function delete($id): RedirectResponse
    {
        $booking = Booking::where('user_id', Auth::user()->id)
            ->where('id', $id)
            ->first();

        $contract = Contract::find($booking->contract_id);
        if ($contract->expires_at >= Carbon::now()) {
            $contract->is_available = true;
            $contract->save();
        } else {
            $contract->delete();
        }

        $booking->delete();

        return redirect()->back()->with(['success' => 'Contract bid cancelled!']);
    }
}
