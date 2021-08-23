<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
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
        $booking->delete();

        return redirect()->back()->with(['success' => 'Booking cancelled!']);
    }
}
