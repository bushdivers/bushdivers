<?php

namespace App\Http\Controllers;

//use Illuminate\Http\Request;
use App\Models\Airport;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\Flight;
use App\Models\Pirep;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
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
