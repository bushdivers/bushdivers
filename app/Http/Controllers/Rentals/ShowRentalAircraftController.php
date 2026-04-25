<?php

namespace App\Http\Controllers\Rentals;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Enums\AircraftType;
use App\Models\Enums\FuelType;
use App\Models\Fleet;
use App\Models\Rental;
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
        $currentLocation = Airport::find(Auth::user()->current_airport_id);
        $with = ['defaultVariant', 'manufacturer'];
        $aircraft = null;
        if ($currentLocation->has_avgas && $currentLocation->has_jetfuel) {
            $aircraft = Fleet::with($with)->whereHas('variants')->where('is_rental', true)->get();
        } elseif ($currentLocation->has_avgas && !$currentLocation->has_jetfuel) {
            $aircraft = Fleet::with($with)->whereHas('variants')->where('is_rental', true)
                ->where('fuel_type', FuelType::AVGAS)
                ->get();
        } elseif ($currentLocation->has_jetfuel && !$currentLocation->has_avgas) {
            $aircraft = Fleet::with($with)->whereHas('variants')->where('is_rental', true)
                ->where('fuel_type', FuelType::JET)
                ->get();
        }

        $aircraft->makeHidden(['used_low_price', 'used_high_price', 'can_purchase_new', 'new_price']);

        $myRentals = Rental::with(['fleet', 'location', 'hub'])
            ->where('user_id', Auth::user()->id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Rentals/RentalList', [
            'aircraft' => $aircraft,
            'myRentals' => $myRentals,
            'currentAirport' => $currentLocation,
            'aircraftTypes' => collect(AircraftType::cases())
                ->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()])
                ->values()
                ->all(),
        ]);
    }
}
