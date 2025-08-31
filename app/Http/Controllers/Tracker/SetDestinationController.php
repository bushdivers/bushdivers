<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Pirep;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        try {
            $pirep = Pirep::with('aircraft')->where('user_id', Auth::id())->findOrFail($request->pirep_id);
            $baseOnly = !$pirep->is_rental && $pirep->aircraft->owner_id == 0; // is BD fleet

            $coord = new Coordinate($request->lat, $request->lon);
            $airport = Airport::when($baseOnly, function (Builder $query) {
                $query->base();
            })->when(!$baseOnly, function (Builder $query) {
                $query->forUser(Auth::user());
            })->inRangeOf($coord, 0, 2)->orderBy('distance')->first();

            if ($airport == null && !$baseOnly && Auth::user()->allow_campsite_airport) {
                // move/set campsite

            }

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }

        if ($airport != null) {
            // update piirep destination to new icao

            $pirep->destination_airport_id = $airport->identifier;
            $pirep->save();

            // return icao
            return response()->json(['icao' => $airport->identifier, 'lat' => $airport->lat, 'lon' => $airport->lon]);
        }

        return response()->json(['message' => 'No airport found in range'], 404);
    }
}
