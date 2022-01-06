<?php

namespace App\Http\Controllers\Pireps;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetLiveFlightsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $liveFlights = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
            ->where('state', PirepState::IN_PROGRESS)
            ->where('is_rental', false)
            ->get();

        $liveRentalFlights = Pirep::with('depAirport', 'arrAirport', 'rental', 'rental.fleet', 'pilot')
            ->where('state', PirepState::IN_PROGRESS)
            ->where('is_rental', true)
            ->get();

        $flights = collect($liveFlights)->merge($liveRentalFlights);

        return response()->json(['flights' => $flights]);
    }
}
