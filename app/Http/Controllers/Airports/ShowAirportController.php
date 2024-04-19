<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\Enums\AircraftStatus;
use App\Services\Airports\FindAirportsWithFuel;
use App\Services\Airports\FindAirportsWithinDistance;
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
    protected FindAirportsWithinDistance $findAirportsWithinDistance;

    public function __construct(GetMetarForAirport $getMetarForAirport, GenerateContracts $generateContracts, StoreContracts $storeContracts, GetNumberToGenerate $getNumberToGenerate, FindAirportsWithinDistance $findAirportsWithinDistance)
    {
        $this->getMetarForAirport = $getMetarForAirport;
        $this->generateContracts = $generateContracts;
        $this->storeContracts = $storeContracts;
        $this->getNumberToGenerate = $getNumberToGenerate;
        $this->findAirportsWithinDistance = $findAirportsWithinDistance;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $icao = null): Response | RedirectResponse
    {
        if (!$icao) return Inertia::render('Airports/AirportDetail');

        $icao = strtoupper($icao);
        $airport = Airport::where('identifier', $icao)->first();

        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        $metar = $this->getMetarForAirport->execute($icao);
        $nearestFuel = $this->findAirportsWithinDistance->execute($airport, 2, 500,false, true, 5);
        $companyAc = Aircraft::with('fleet')
            ->where('owner_id', 0)
            ->where('status', AircraftStatus::ACTIVE)
            ->get();

        $privateAc = Aircraft::with('fleet')
            ->where('owner_id', Auth::user()->id)
            ->where('status', AircraftStatus::ACTIVE)
            ->get();

        // get contracts
        $contracts = $this->getContracts($icao);

        if ($contracts->count() <= 20) {
            $numToGenerate = $this->getNumberToGenerate->execute($airport, $contracts->count());
            if ($numToGenerate > 0) {
                $newContracts = $this->generateContracts->execute($airport, $numToGenerate);
                if ($newContracts !== null) {
                    $this->storeContracts->execute($newContracts);
                }
            }
            $contracts = $this->getContracts($icao);
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
            'metar' => $metar,
            'fuel' => $nearestFuel,
            'myContracts' => $myContracts,
            'sharedContracts' => $sharedContracts
        ]);
    }

    protected function getContracts(string $icao)
    {
        return Contract::with(['depAirport', 'currentAirport', 'arrAirport'])
            ->where('dep_airport_id', $icao)
            ->where('is_available', true)
            ->whereRaw('expires_at >= Now()')
            ->orderBy('distance')
            ->get();
    }
}
