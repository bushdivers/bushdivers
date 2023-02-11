<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\Enums\AircraftStatus;
use App\Services\Airports\GetMetarForAirport;
use App\Services\Contracts\GenerateContracts;
use App\Services\Contracts\StoreContracts;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ShowAirportController extends Controller
{

    protected GetMetarForAirport $getMetarForAirport;
    protected GenerateContracts $generateContracts;
    protected StoreContracts $storeContracts;

    public function __construct(GetMetarForAirport $getMetarForAirport, GenerateContracts $generateContracts, StoreContracts $storeContracts)
    {
        $this->getMetarForAirport = $getMetarForAirport;
        $this->generateContracts = $generateContracts;
        $this->storeContracts = $storeContracts;
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

        if (Cache::has($icao)) {
            $airport = Cache::get($icao);
        } else {
            $airport = Airport::where('identifier', $icao)->first();
            Cache::put($icao, $airport, now()->addHours(23));
        }


        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        // $metar = $this->getMetarForAirport->execute($icao);
        $companyAc = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->where('owner_id', 0)
            ->where('status', AircraftStatus::ACTIVE)
            ->get();

        $privateAc = Aircraft::with('fleet')
            ->where('current_airport_id', $icao)
            ->where('owner_id', Auth::user()->id)
            ->where('status', AircraftStatus::ACTIVE)
            ->get();

        $aircraft = $companyAc->merge($privateAc);

        // get contracts
        $contracts = $this->getContracts($icao);
        if ($contracts->count() <= 10) {
            if ($airport->is_hub) {
                $numToGenerate = 25 - $contracts->count();
            } else {
                $numToGenerate = $airport->size >= 3 ? 18 - $contracts->count() : 9 - $contracts->count();
            }
            if ($numToGenerate > 0) {
                $newContracts = $this->generateContracts->execute($airport, $numToGenerate);
                if ($newContracts !== null) {
                    $this->storeContracts->execute($newContracts);
                }
            }
            $contracts = $this->getContracts($icao);
        }

        return Inertia::render('Airports/AirportDetail', ['airport' => $airport, 'aircraft' => $aircraft, 'contracts' => $contracts]); //'metar' => $metar
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
