<?php

namespace App\Http\Controllers;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AirportController extends Controller
{
    protected WeatherService $wxService;

    public function __construct(WeatherService $weatherService)
    {
        $this->wxService = $weatherService;
    }

    public function index($icao): Response
    {
        $airport = Airport::where('identifier', $icao)->first();
        $metar = $this->wxService->getMetar($icao);
        $aircraft = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->get();
        return Inertia::render('Airports/AirportDetail', ['airport' => $airport, 'metar' => $metar, 'aircraft' => $aircraft]);
    }

    public function hubs()
    {
        $hubs = Airport::where('is_hub', true)->get();
        return Inertia::render('Airports/Hubs', ['hubs' => $hubs]);
    }
}
