<?php

namespace App\Http\Controllers\Pireps;

use App\Http\Controllers\Controller;
use App\Http\Resources\PirepIVAOCollection;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class GetLiveFlightsController extends Controller
{
    // Default API response
    public function __invoke(Request $request): JsonResponse
    {
        $flights = $this->getLiveFlights();
        return response()->json(['flights' => $flights]);
    }

    // Whazzup response based on IVAO JSON format
    public  function whazzup(): JsonResponse
    {
        $flights = $this->getLiveFlights();
        return response()->json(new PirepIVAOCollection($flights));
    }

    private function getLiveFlights(): Collection
    {
        $liveFlights = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot', 'logs')
            ->whereIn('state', [PirepState::DISPATCH, PirepState::IN_PROGRESS])
            ->where('is_rental', false)
            ->get();

        $liveRentalFlights = Pirep::with('depAirport', 'arrAirport', 'rental', 'rental.fleet', 'pilot', 'logs')
            ->whereIn('state', [PirepState::DISPATCH, PirepState::IN_PROGRESS])
            ->where('is_rental', true)
            ->get();

        return collect($liveFlights)->merge($liveRentalFlights);
    }
}
