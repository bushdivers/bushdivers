<?php

namespace App\Http\Controllers\Pireps;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetLiveFlightsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $liveFlights = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
            ->where('state', PirepState::IN_PROGRESS)
            ->get();

        return response()->json(['flights' => $liveFlights]);
    }
}
