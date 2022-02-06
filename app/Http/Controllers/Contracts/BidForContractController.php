<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Contract;
use App\Services\Contracts\GetContractsFromCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BidForContractController extends Controller
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
        $contract = Contract::find($request->id);

        // set contract to not available
        $contract->is_available = false;
        $contract->save();

        $criteria = [
            'icao' => $request->icao,
            'distance' => $request->distance,
            'cargo' => $request->cargo,
            'pax' => $request->pax
        ];

        $contracts = $this->getContractsFromCriteria->execute($criteria);
        $airport = Airport::where('identifier', $criteria['icao'])->first();

        return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport])->with(['success' => 'Contract accepted successfully']);
    }
}
