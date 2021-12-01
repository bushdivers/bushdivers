<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\Contracts\GetContractsFromCriteria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FindContractsController extends Controller
{
    protected GetContractsFromCriteria $getContractsFromCriteria;

    public function __construct(GetContractsFromCriteria $getContractsFromCriteria)
    {
        $this->getContractsFromCriteria = $getContractsFromCriteria;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $criteria = [
            'icao' => $request->icao,
            'distance' => $request->distance,
            'cargo' => $request->cargo,
            'pax' => $request->pax
        ];

        $airport = Airport::where('identifier', $criteria['icao'])->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
        }

        $contracts = $this->getContractsFromCriteria->execute($criteria);

        return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport]);
    }
}
