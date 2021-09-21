<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use App\Models\Booking;
use App\Models\Contract;
use App\Models\Enums\ContractType;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $criteria = [
            'icao' => $request->icao,
            'distance' => $request->distance,
            'cargo' => $request->cargo,
            'pax' => $request->pax
        ];

        $contracts = $this->getContractsFromCriteria($criteria);


        $airport = Airport::where('identifier', $criteria['icao'])->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
        }

        return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport]);
    }

    public function bidForContract(Request $request): Response
    {
        $contract = Contract::find($request->id);
        // add booking
        $booking = new Booking();
        $booking->user_id = Auth::user()->id;
        $booking->contract_id = $contract->id;
        $booking->bid_qty = $contract->contract_type_id == ContractType::Cargo ? $contract->cargo_qty : $contract->pax_qty;
        $booking->save();

        // set contract to not available
        $contract->is_available = false;
        $contract->save();

        $criteria = [
            'icao' => $request->icao,
            'distance' => $request->distance,
            'cargo' => $request->cargo,
            'pax' => $request->pax
        ];

        $contracts = $this->getContractsFromCriteria($criteria);
        $airport = Airport::where('identifier', $criteria['icao'])->first();

        return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport])->with(['success' => 'Contract bid successfully']);
    }

    protected function getContractsFromCriteria($criteria): Collection
    {
        $icao = $criteria['icao'];
        $distance = $criteria['distance'];
        $cargo = $criteria['cargo'];
        $pax = $criteria['pax'];

        $range = match ($distance) {
            "Up to 50nm" => [0, 50],
            "50nm-150nm" => [51, 150],
            "150nm+" => [151, 5000]
        };
        return Contract::with('depAirport', 'arrAirport', 'currentAirport')
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
    }
}
