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
        $icao = mb_convert_encoding($request->icao, "UTF-8", "auto");
        $airport = Airport::where('identifier', $icao)->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
        }

        $key = $this->buildCacheKey($request->icao, $request->flightLength, $request->aircraftSize);

        if (Cache::has($key)) {
            $contracts = Cache::get($key);
        } else {
            $numToGenerate = $airport->is_hub ? 12 : 6;
            $contracts = $this->generateContracts->execute($airport, $numToGenerate, $request->flightLength, $request->aircraftSize);
//            Cache::put($key, $contracts, now()->addSeconds(120));
        }

        return Inertia::render('Contracts/Contracts', ['searchedContracts' => $contracts, 'airport' => $airport]);
    }

    protected function buildCacheKey(string $icao, string $distance, string $size): string
    {
        return mb_convert_encoding($icao.'-'.$distance.'-'.$size, 'UTF-8', 'UTF-8');
    }
}
