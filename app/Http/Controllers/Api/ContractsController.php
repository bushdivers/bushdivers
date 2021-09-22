<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Contract;
use App\Services\ContractService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractsController extends Controller
{
    public function test()
    {
        $contractService = new ContractService();
        //$contractService->findAirportsInNeedOfContracts();
        $contractService->findHubsInNeedOfContracts();
    }

    public function getContracts($icao, $distance, $cargo, $pax): JsonResponse
    {
        $airport = Airport::where('identifier', $icao)->first();
        if (!$airport) {
            return response()->json(['message' => 'Airport not found']);
        }

        $range = match ($distance) {
            "Up to 50nm" => [0, 50],
            "50nm-150nm" => [51, 150],
            "150nm+" => [151, 5000]
        };

        $contracts = Contract::with('depAirport', 'arrAirport', 'currentAirport')
            ->where('dep_airport_id', $icao)
            ->where('is_available', true)
            ->where('expires_at', '>', Carbon::now())
            ->whereBetween('distance', $range)
            ->where(function ($query) use ($cargo) {
                $query->where('cargo_qty', '<=', $cargo)
                    ->orWhereNull('cargo_qty');
            })
            ->where(function ($query) use ($pax) {
                $query->where('pax_qty', '<=', $pax)
                    ->orWhereNull('pax_qty');
            })
            ->get();

        return response()->json(['contracts' => $contracts, 'airport' => $airport]);
    }
}
