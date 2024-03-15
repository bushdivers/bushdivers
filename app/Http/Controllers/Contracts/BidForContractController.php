<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Contract;
use App\Services\Airports\UpdateFuelAtAirport;
use App\Services\Contracts\GenerateContracts;
use App\Services\Contracts\StoreContracts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class BidForContractController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, UpdateFuelAtAirport $updateFuelAtAirport, GenerateContracts $generateContracts, StoreContracts $storeContracts): JsonResponse
    {
        $contract = Contract::findOrFail($request->id);
        if ($request->action == 'remove') {
            if ($contract->is_fuel) {
                $updateFuelAtAirport->execute($contract->dep_airport_id, $contract->fuel_qty, $contract->fuel_type,
                    'increment');
                $contract->delete();
                return \response()->json(['message' => 'Contract updated']);
            }

            $contract->is_available = true;
            $contract->user_id = null;
            Cache::forget($contract->dep_airport_id.'-contracts');
        } else {
            // generate return to hub
            $airport = Airport::where('identifier', $contract->arr_airport_id)->first();

            $airportContracts = Contract::with('arrAirport')
                ->where('dep_airport_id', $airport->identifier)
                ->whereHas('arrAirport', function ($query) {
                    $query->where('is_hub', true);
                })
                ->get();

            if ($airportContracts->count() == 0) {
                // generate new contract back to hub
                $originAirport = Airport::where('identifier', $contract->dep_airport_id)->first();
                $contracts = $generateContracts->execute($originAirport, 1, true);
                if ($contracts) {
                    $storeContracts->execute($contracts);
                }
            }

            // update contract for user
            $contract->is_available = false;
            $contract->user_id = $request->userId;
            Cache::forget($contract->dep_airport_id.'-contracts');
        }
        $contract->save();

        return \response()->json(['message' => 'Contract updated']);
    }
}
