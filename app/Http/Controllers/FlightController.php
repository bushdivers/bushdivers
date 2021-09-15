<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use App\Models\Booking;
use App\Models\Flight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FlightController extends Controller
{
    public function index()
    {
        $flights = Flight::with(['depAirport', 'arrAirport'])
            ->where('dep_airport_id', Auth::user()->current_airport_id)
            ->where('is_active', true)
            ->get();

        $bookings = Booking::where('user_id', Auth::user()->id)->get();

        return Inertia::render('Flights/FlightSearch', ['flights' => $flights, 'bookings' => $bookings]);
    }

    public function search(Request $request)
    {
        $dep = $request->query('dep');
        $arr = $request->query('arr');

        $where = [];
        if ($dep) $where[] = ['dep_airport_id', $dep];
        if ($arr) $where[] = ['arr_airport_id', $arr];
        $flights = Flight::with(['depAirport', 'arrAirport'])
            ->where('is_active', true)
            ->where($where)
            ->get();

        $bookings = Booking::where('user_id', Auth::user()->id)->get();

        return Inertia::render('Flights/FlightSearch', [
            'flights' => $flights,
            'bookings' => $bookings
        ]);
    }

    public function routes()
    {
        $airports = DB::table('airports')
            ->join('flights', 'airports.identifier', '=', 'flights.arr_airport_id')
            ->select('airports.identifier', 'airports.name', 'airports.lon', 'airports.lat', 'airports.is_hub')
            ->where('airports.is_hub', false)
            ->distinct()
            ->get();

        $hubs = Airport::where('is_hub', true)->get();

        $flights = Flight::with('depAirport', 'arrAirport')->where('is_active', true)->get();

        return Inertia::render('Flights/RouteMap', ['flights' => $flights, 'airports' => $airports, 'hubs' => $hubs]);
    }
}
