<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowHomeController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $flights = Pirep::where('state', PirepState::ACCEPTED)->get();
        $flightCount = $flights->count();
        $hours = $flights->sum('flight_time');
        $pilots = User::where('is_active', true)->count();
        $hubs = Airport::where('is_hub', true)->count();

        return Inertia::render('Home', ['stats' => [
            'flights' => $flightCount,
            'hours' => $hours,
            'pilots' => $pilots,
            'hubs' => $hubs
        ]]);
    }
}
