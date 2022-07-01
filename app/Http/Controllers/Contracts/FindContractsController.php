<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\Contracts\GenerateContracts;
use App\Services\Contracts\GetContractsFromCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class FindContractsController extends Controller
{
    protected GenerateContracts $generateContracts;

    public function __construct(GenerateContracts $generateContracts)
    {
        $this->generateContracts = $generateContracts;
        // $this->getContractsFromCriteria = $getContractsFromCriteria;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $airport = Airport::where('identifier', $request->icao)->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
        }

        $key = $this->buildCacheKey($request->icao, $request->flightLength, $request->aircraftSize);

        if (Cache::has($key)) {
            $contracts = Cache::get($key);
        } else {
            if ($airport->is_hub) {
                $numToGenerate = 25;
            } else {
                $numToGenerate = $airport->size >= 3 ? 12 : 5;
            }
            $contracts = $this->generateContracts->execute($airport, $numToGenerate, $request->flightLength, $request->aircraftSize);
            Cache::put($key, $contracts, now()->addSeconds(120));
        }

        return Inertia::render('Contracts/Contracts', ['searchedContracts' => $contracts, 'airport' => $airport]);
    }

    protected function buildCacheKey(string $icao, string $distance, string $size): string
    {
        return $icao.'-'.$distance.'-'.$size;
    }
}
