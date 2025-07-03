<?php

namespace App\Http\Controllers\Contracts\Experimental;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ContractGeneratorRequest;
use App\Models\Airport;
use App\Services\Contracts\GenerateContractExperimental;

class ContractGeneratorController extends Controller
{
    public function __invoke(ContractGeneratorRequest $request, GenerateContractExperimental $generateContractExperimental)
    {
        $departureAirport = Airport::where('identifier', $request->icaoDep)->first();
        // get random airport
        $nearbyAirports = Airport::inRangeof($departureAirport, 30, $request->maxDistance)->minSize($request->minSize)->get();
        $destinationAirport = $nearbyAirports->random(1)[0];
        // call service to prepare and send request to AI
        $details = $generateContractExperimental->execute($departureAirport, $destinationAirport, $request->cargoType, $request->maxCargo, $request->aircraftSize);
        // return result
        return response()->json(['contract' => $details, 'departure' => $departureAirport, 'destination' => $destinationAirport], 200); 
    }

}
