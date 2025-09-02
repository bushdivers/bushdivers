<?php

namespace App\Http\Controllers\Rentals;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Fleet;
use App\Models\Rental;
use App\Models\Enums\AircraftState;
use App\Models\Enums\FuelType;
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
    public function __invoke(Request $request): Response
    {
        $currentLocation = Airport::where('identifier', Auth::user()->current_airport_id)->first();
        $aircraft = null;
        if ($currentLocation->has_avgas && $currentLocation->has_jetfuel) {
            $aircraft = Fleet::where('is_rental', true)->get();
        } else if ($currentLocation->has_avgas && !$currentLocation->has_jetfuel) {
            $aircraft = Fleet::where('is_rental', true)
                ->where('fuel_type', FuelType::AVGAS)
                ->get();
        } else if ($currentLocation->has_jetfuel && !$currentLocation->has_avgas) {
            $aircraft = Fleet::where('is_rental', true)
                ->where('fuel_type', FuelType::JET)
                ->get();
        }

        $myRentals = Rental::with(['fleet', 'location', 'hub'])
            ->where('user_id', Auth::user()->id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Rentals/RentalList', ['aircraft' => $aircraft, 'myRentals' => $myRentals, 'currentAirport' => $currentLocation]);
    }
}
