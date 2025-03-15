<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Location\Coordinate;

class SetDestinationController extends Controller
{

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
            $coord = new Coordinate($request->lat, $request->lon);
            $airport = Airport::inRangeOf($coord, 0, 2)->orderBy('distance')->first();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
        if ($airport != null) {
            // update piirep destination to new icao
            $pirep = Pirep::findOrFail($request->pirep_id);
            $pirep->destination_airport_id = $airport->identifier;
            $pirep->save();

            // return icao
            return response()->json(['icao' => $airport->identifier, 'lat' => $airport->lat, 'lon' => $airport->lon]);
        }

        return response()->json(404);
    }
}
