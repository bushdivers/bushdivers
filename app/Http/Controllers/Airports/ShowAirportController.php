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
use Carbon\Carbon;
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
        if (!$icao)
            return redirect()->back()->with(['error' => 'Airport not found']);

        $icao = strtoupper($icao);
        $airport = Airport::where('identifier', $icao)->first();

        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        $nearestFuel = Airport::inRangeOf($airport, 2, 500)->fuel()->orderBy('distance')->limit(5)->get();
        $companyAc = Aircraft::with(['fleet', 'engines', 'hub', 'location'])
            ->where('owner_id', 0)
            ->where('status', AircraftStatus::ACTIVE)
            ->get();

        $privateAc = Aircraft::with(['fleet', 'engines', 'hub', 'location'])
            ->where('owner_id', Auth::user()->id)
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

        $myContracts = Contract::with(['depAirport', 'currentAirport', 'arrAirport'])
            ->where('user_id', Auth::user()->id)
            ->where('is_completed', false)
            ->orderBy('distance')
            ->get();

        $sharedContracts = Contract::with(['depAirport', 'currentAirport', 'arrAirport'])
            ->where('user_id', null)
            ->where('is_shared', true)
            ->where('is_completed', false)
            ->orderBy('distance')
            ->get();

        return Inertia::render('Airports/AirportDetail', [
            'airport' => $airport,
            'fleet' => $companyAc,
            'aircraft' => $privateAc,
            'contracts' => $contracts,
            'metar' => Inertia::defer(fn() => $this->getMetarForAirport->execute($icao)),
            'fuel' => $nearestFuel,
            'myContracts' => $myContracts,
            'sharedContracts' => $sharedContracts
        ]);
    }

    protected function getContracts(Airport $airport)
    {
        $user = Auth::user();
        // Filter dest to user preferences. Current/dep doesn't matter since either the user is already there (regardless of choice), or they haven't found the airport to fly to
        return Contract::with(['depAirport', 'currentAirport', 'arrAirport'])
            ->whereHas('arrAirport', fn($q) => $q->forUser($user))
            ->where('dep_airport_id', $airport->id)
            ->where('is_available', true)
            ->whereRaw('expires_at >= Now()')
            ->orderBy('distance')
            ->get();
    }
}
