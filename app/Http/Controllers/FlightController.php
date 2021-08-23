<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FlightController extends Controller
{
    public function index()
    {
        $flights = Flight::where('dep_airport_id', Auth::user()->current_airport_id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Flights/FlightSearch', ['flights' => $flights]);
    }

    public function search(Request $request)
    {
        $dep = $request->query('dep');
        $arr = $request->query('arr');

        $where = [];
        if ($dep) $where[] = ['dep_airport_id', $dep];
        if ($arr) $where[] = ['arr_airport_id', $arr];
        $flights = Flight::where('is_active', true)
            ->where($where)
            ->get();

        return Inertia::render('Flights/FlightSearch', [
            'flights' => $flights
        ]);
    }
}
