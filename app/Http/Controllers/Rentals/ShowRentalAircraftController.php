<?php

namespace App\Http\Controllers\Rentals;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Fleet;
use App\Models\Rental;
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
    public function __invoke(Request $request): Response
    {
        $currentLocation = Airport::where('identifier', Auth::user()->current_airport_id)->first();

        if ($currentLocation->is_hub) {
            if ($currentLocation->size >= 3) {
                $aircraft = Fleet::where('is_rental', true)->get();
            }
            if ($currentLocation->size < 3) {
                $aircraft = Fleet::where('is_rental', true)
                    ->where('size', 0)
                    ->get();
            }
        } else {
            $aircraft = [];
        }


        $myRentals = Rental::with('fleet')
            ->where('user_id', Auth::user()->id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Rentals/RentalList', ['aircraft' => $aircraft, 'myRentals' => $myRentals]);
    }
}
