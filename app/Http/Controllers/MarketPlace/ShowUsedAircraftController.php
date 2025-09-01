<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Fleet;
use App\Services\Aircraft\GenerateAircraft;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowUsedAircraftController extends Controller
{
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;
    protected GenerateAircraft $generateAircraft;

    public function __construct(CalcDistanceBetweenPoints $calcDistanceBetweenPoints, GenerateAircraft $generateAircraft)
    {
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
        $this->generateAircraft = $generateAircraft;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke($fleet, $buyer): Response
    {
        $currentLocation = Airport::where('identifier', Auth::user()->current_airport_id)->first();
        $fleetDetail = Fleet::find($fleet);

        $this->generateAircraft->execute($fleet, $currentLocation);

        $allAirports = Airport::inRangeOf($currentLocation, 0, 300)->get();
        $allAirportsId = $allAirports->pluck('id');
        $currentAircraftForSale = Aircraft::with('location', 'fleet', 'engines')
            ->where('owner_id', null)
            ->where('fleet_id', $fleet)
            ->whereIn('current_airport_id', $allAirportsId)
            ->get();

        return Inertia::render('Marketplace/UsedAircraft', ['aircraft' => $currentAircraftForSale, 'currentLocation' => $currentLocation, 'fleet' => $fleetDetail, 'buyer' => $buyer]);
    }
}
