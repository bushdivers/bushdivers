<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FlightController extends Controller
{
    public function search()
    {
        $flights = Flight::where('dep_airport_id', Auth::user()->current_airport_id)
            ->where('is_active', true)
            ->orderBy('arr_airport_id')
            ->get();
        return Inertia::render('Flights/FlightSearch', ['flights' => $flights]);
    }
}
