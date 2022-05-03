<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Fleet;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowUsedAircraftController extends Controller
{
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;

    public function __construct(CalcDistanceBetweenPoints $calcDistanceBetweenPoints)
    {
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke($fleet): Response
    {
        $currentLocation = Airport::where('identifier', Auth::user()->current_airport_id)->first();

        $airports = DB::select(DB::raw(
            "SELECT *
                        FROM (
                          SELECT
                            airports.identifier,
                            3956 * ACOS(COS(RADIANS($currentLocation->lat)) * COS(RADIANS(lat)) * COS(RADIANS($currentLocation->lon) - RADIANS(lon)) + SIN(RADIANS($currentLocation->lat)) * SIN(RADIANS(lat))) AS `distance`
                          FROM airports
                          WHERE
                            lat
                              BETWEEN $currentLocation->lat - (300 / 69)
                              AND $currentLocation->lat + (300 / 69)
                            AND lon
                              BETWEEN $currentLocation->lon - (300 / (69 * COS(RADIANS($currentLocation->lat))))
                              AND $currentLocation->lon + (300 / (69* COS(RADIANS($currentLocation->lat))))
                        ) r
                        WHERE distance < 251
                        ORDER BY distance ASC"
        ));

        $allAirports = collect($airports);
        $allAirports = $allAirports->pluck('identifier');
        $aircraft = Aircraft::with('location', 'fleet', 'engines')
            ->where('owner_id', null)
            ->where('fleet_id', $fleet)
            ->whereIn('current_airport_id', $allAirports)
            ->orderBy('sale_price')
            ->get();

        $fleetDetail = Fleet::find($fleet);

        return Inertia::render('Marketplace/UsedAircraft', ['aircraft' => $aircraft, 'currentLocation' => $currentLocation, 'fleet' => $fleetDetail]);
    }
}
