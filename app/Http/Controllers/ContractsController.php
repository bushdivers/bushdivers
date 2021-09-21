<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use App\Models\Contract;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Contracts/Contracts');
    }

    public function getContracts(Request $request): Response
    {
        $icao = $request->icao;
        $distance = $request->distance;
        $cargo = $request->cargo;
        $pax = $request->pax;

        $airport = Airport::where('identifier', $icao)->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
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
        return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport]);
    }
}
