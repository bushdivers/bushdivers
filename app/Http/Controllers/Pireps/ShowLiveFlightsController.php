<?php

namespace App\Http\Controllers\Pireps;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowLiveFlightsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $liveFlights = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
            ->where('state', PirepState::IN_PROGRESS)
            ->get();
        return Inertia::render('Flights/LiveFlights', ['flights' => $liveFlights]);
    }
}
