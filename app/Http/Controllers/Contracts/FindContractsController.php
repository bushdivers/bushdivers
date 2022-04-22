<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\Contracts\GenerateContracts;
use App\Services\Contracts\GetContractsFromCriteria;
use Illuminate\Http\Request;
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
        // TODO: Update to generate contracts on fly
        $airport = Airport::where('identifier', $request->icao)->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
        }

        // generate contracts on the fly
        $numToGenerate = $airport->is_hub ? 12 : 6;
        $contracts = $this->generateContracts->execute($airport, $numToGenerate, $request->flightLength, $request->aircraftSize);
        // $contracts = $this->getContractsFromCriteria->execute($request->icao, $request->sort);
        return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport]);
    }
}
