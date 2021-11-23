<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Services\WeatherService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAirportController extends Controller
{

    protected WeatherService $wxService;

    public function __construct(WeatherService $weatherService)
    {
        $this->wxService = $weatherService;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $icao): Response | RedirectResponse
    {
        if (!$icao) return Inertia::render('Airports/AirportDetail');

        $airport = Airport::where('identifier', $icao)->first();

        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        $metar = $this->wxService->getMetar($icao);
        $aircraft = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->get();
        return Inertia::render('Airports/AirportDetail', ['airport' => $airport, 'metar' => $metar, 'aircraft' => $aircraft]);
    }
}
