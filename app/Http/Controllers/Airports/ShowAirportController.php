<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AircraftStatus;
use App\Services\Airports\GetMetarForAirport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ShowAirportController extends Controller
{

    protected GetMetarForAirport $getMetarForAirport;

    public function __construct(GetMetarForAirport $getMetarForAirport)
    {
        $this->getMetarForAirport = $getMetarForAirport;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $icao = null): Response | RedirectResponse
    {
        if (!$icao) return Inertia::render('Airports/AirportDetail');

        if (Cache::has($icao)) {
            $airport = Cache::get($icao);
        } else {
            $airport = Airport::where('identifier', $icao)->first();
            Cache::put($icao, $airport, now()->addHours(23));
        }


        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        $metar = $this->getMetarForAirport->execute($icao);
        $aircraft = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->where('owner_id', 0)
            ->where('status', AircraftStatus::ACTIVE)
            ->get();
        return Inertia::render('Airports/AirportDetail', ['airport' => $airport, 'metar' => $metar, 'aircraft' => $aircraft]);
    }
}
