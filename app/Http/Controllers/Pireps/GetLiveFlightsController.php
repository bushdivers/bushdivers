<?php

namespace App\Http\Controllers\Pireps;

use App\Http\Controllers\Controller;
use App\Http\Resources\PirepIVAOCollection;
use App\Http\Resources\PirepLiveMapResource;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class GetLiveFlightsController extends Controller
{
    // Default API response
    public function __invoke(Request $request): JsonResponse
    {
        $flights = $this->getLiveFlights();
        return response()->json(['flights' => PirepLiveMapResource::collection($flights)]);
    }

    // Whazzup response based on IVAO JSON format
    public function whazzup(): JsonResponse
    {
        $flights = $this->getLiveFlights();
        return response()->json(new PirepIVAOCollection($flights));
    }

    private function getLiveFlights(): Collection
    {
        return Cache::remember('GetLiveFlightsController', 9, function () {
            $all = Pirep::with(['depAirport', 'arrAirport', 'pilot', 'logs'])
                ->whereIn('state', [PirepState::DISPATCH, PirepState::IN_PROGRESS])
                ->get();

            [$rentalFlights, $liveFlights] = $all->partition(fn ($p) => $p->is_rental);

            $liveFlights->loadMissing(['aircraft', 'aircraft.fleet']);
            $rentalFlights->loadMissing(['rental', 'rental.fleet']);
            return $all;
        });
    }
}
