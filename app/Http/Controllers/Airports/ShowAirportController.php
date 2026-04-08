<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\Enums\AircraftStatus;
use App\Services\Airports\GetMetarForAirport;
use App\Services\Contracts\GenerateContracts;
use App\Services\Contracts\GetNumberToGenerate;
use App\Services\Contracts\StoreContracts;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowAirportController extends Controller
{
    protected GetMetarForAirport $getMetarForAirport;
    protected GenerateContracts $generateContracts;
    protected StoreContracts $storeContracts;
    protected GetNumberToGenerate $getNumberToGenerate;

    public function __construct(GetMetarForAirport $getMetarForAirport, GenerateContracts $generateContracts, StoreContracts $storeContracts, GetNumberToGenerate $getNumberToGenerate)
    {
        $this->getMetarForAirport = $getMetarForAirport;
        $this->generateContracts = $generateContracts;
        $this->storeContracts = $storeContracts;
        $this->getNumberToGenerate = $getNumberToGenerate;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $icao = null): Response | RedirectResponse
    {
        if (!$icao) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        $icao = strtoupper($icao);
        $airport = Airport::where('identifier', $icao)->first();

        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        $nearestFuel = Airport::inRangeOf($airport, 2, 500)->fuel()->orderBy('distance')->limit(5)->get();
        $aircraft = Aircraft::with(['fleet', 'engines', 'hub', 'location'])
            ->whereIn('owner_id', [0, Auth::id()])
            ->where('status', AircraftStatus::ACTIVE)
            ->get();

        // get contracts
        $contracts = $this->getContracts($airport);

        if ($contracts->count() <= 20) {
            $numToGenerate = $this->getNumberToGenerate->execute($airport, $contracts->count());
            if ($numToGenerate > 0) {
                $newContracts = $this->generateContracts->execute($airport, $numToGenerate);
                if ($newContracts !== null) {
                    $this->storeContracts->execute($newContracts);
                }
            }
            $contracts = $this->getContracts($airport);
        }

        $userContracts = Contract::with(['depAirport', 'currentAirport', 'arrAirport'])
            ->where(fn ($q) => $q->where('user_id', Auth::id())->orWhere(fn ($q) => $q->whereNull('user_id')->where('is_shared', true)))
            ->where('is_completed', false)
            ->orderBy('distance')
            ->get();

        return Inertia::render('Airports/AirportDetail', [
            'airport' => $airport,
            'aircraft' => $aircraft,
            'contracts' => $contracts,
            'metar' => Inertia::defer(fn () => $this->getMetarForAirport->execute($icao)),
            'fuel' => $nearestFuel,
            'userContracts' => $userContracts,
        ]);
    }

    protected function getContracts(Airport $airport)
    {
        $user = Auth::user();
        // Filter dest to user preferences. Current/dep doesn't matter since either the user is already there (regardless of choice), or they haven't found the airport to fly to
        return Contract::with(['depAirport', 'currentAirport', 'arrAirport'])
            ->whereHas('arrAirport', fn ($q) => $q->forUser($user))
            ->where('dep_airport_id', $airport->id)
            ->where('is_available', true)
            ->whereRaw('expires_at >= Now()')
            ->orderBy('distance')
            ->get();
    }
}
