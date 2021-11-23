<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetAirportFromSearchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $search): JsonResponse
    {
        $airport = Airport::where('identifier', $search)->first();
        return response()->json(['airport' => $airport]);
    }
}
