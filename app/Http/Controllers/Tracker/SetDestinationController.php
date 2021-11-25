<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Pirep;
use App\Services\Airports\FindAirportsByLatLon;
use App\Services\AirportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SetDestinationController extends Controller
{
    protected FindAirportsByLatLon $findAirportsByLatLon;

    public function __construct(FindAirportsByLatLon $findAirportsByLatLon)
    {
        $this->findAirportsByLatLon = $findAirportsByLatLon;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        // find nearest airport
        try {
            $airport = $this->findAirportsByLatLon->execute($request->lat, $request->lon, 2);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
        if ($airport != null) {
            // update piirep destination to new icao
            $pirep = Pirep::find($request->pirep_id);
            $pirep->destination_airport_id = $airport->identifier;
            $pirep->save();

            // return icao
            return response()->json(['icao' => $airport->identifier]);
        }

        return response()->json(404);
    }
}
