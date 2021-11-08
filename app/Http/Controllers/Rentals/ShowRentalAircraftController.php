<?php

namespace App\Http\Controllers\Rentals;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowRentalAircraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $icao = null): Response
    {
        if ($icao) {
            $aircraft = Aircraft::with('fleet', 'location')
                ->where('is_rental', true)
                ->where('user_id', null)
                ->where('current_airport_id', $icao)
                ->get();
        } else {
            $aircraft = Aircraft::with('fleet', 'location')
                ->where('is_rental', true)
                ->where('user_id', null)
                ->get();
        }

        $myRentals = Aircraft::with('fleet', 'location')
            ->where('is_rental', true)
            ->where('user_id', Auth::user()->id)
            ->get();

        return Inertia::render('Rentals/RentalList', ['aircraft' => $aircraft, 'searchedIcao' => $icao, 'myRentals' => $myRentals]);
    }
}
