<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\ContractType;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\PirepState;
use App\Models\Enums\TransactionTypes;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Services\PirepService;
use App\Services\UserService;
use Carbon\Carbon;
use App\Models\User;
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

        $airport = Airport::where('identifier', $criteria['icao'])->first();
        if (!$airport) {
            return Inertia::render('Contracts/Contracts')->with(['error' => 'Airport not found']);
        }

        $contracts = $this->getContractsFromCriteria($criteria);

        return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport]);
    }

    public function bidForContract(Request $request): Response
    {
        $contract = Contract::find($request->id);

        // set contract to not available
        $contract->is_available = false;
        $contract->user_id = Auth::user()->id;
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

    public function cancelContract(Request $request): RedirectResponse
    {

        $contract = Contract::find($request->id);

        // check if contract has cargo in a non-completed pirep
        $cargo = ContractCargo::where('contract_id', $contract->id)->pluck('id');
        $pc = PirepCargo::whereIn('contract_cargo_id', $cargo)->pluck('pirep_id');
        $pirepsCount = Pirep::where('user_id', Auth::user()->id)
            ->where('state', '<>', PirepState::ACCEPTED)
            ->whereIn('id', $pc)
            ->count();

        if ($pirepsCount > 0) {
            return redirect()->back()->with(['error' => 'Contract is part of an active dispatch and cannot be cancelled']);
        }

        // set contract to not available
        $contract->is_available = true;
        $contract->user_id = null;
        $contract->save();

        // penalty charge to user
//        $charge = (FinancialConsts::CancelPenalty / 100) * $contract->contract_value;
//        $userService = new UserService();
//        $userService->addUserAccountEntry(Auth::user()->id, TransactionTypes::ContractPenalty, -$charge);
//        $userService->updateUserAccountBalance(Auth::user()->id, -$charge);

        $user = User::find(Auth::user()->id);
        if ($user->points >= 1) {
            $user->points -= 1;
            $user->save();
        }

        return redirect()->back()->with(['success' => 'Contract bid cancelled successfully']);
    }

    public function myContracts(): Response
    {
        $contracts = Contract::with('depAirport', 'arrAirport', 'cargo', 'cargo.currentAirport')
            ->where('is_completed', false)
            ->where('user_id', Auth::user()->id)
            ->get();

        return Inertia::render('Contracts/MyContracts', ['contracts' => $contracts]);
    }

    public function completedContracts(): Response
    {
        $contracts = Contract::with('depAirport', 'arrAirport', 'cargo')
            ->where('is_completed', true)
            ->where('user_id', Auth::user()->id)
            ->get();

        return Inertia::render('Contracts/CompletedContracts', ['contracts' => $contracts]);
    }

    protected function getContractsFromCriteria($criteria): array
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

        $paxContracts =  Contract::with('depAirport', 'arrAirport', 'cargo', 'cargo.currentAirport')
            ->where('dep_airport_id', $icao)
            ->where('is_available', true)
            ->where('expires_at', '>', Carbon::now())
            ->whereBetween('distance', $range)
            ->whereHas('cargo', function ($q) use($pax) {
                $q->where('contract_type_id', ContractType::Passenger)
                    ->where('cargo_qty', '<=', $pax);
            })->get();

        $cargoContracts =  Contract::with('depAirport', 'arrAirport', 'cargo', 'cargo.currentAirport')
            ->where('dep_airport_id', $icao)
            ->where('is_available', true)
            ->where('expires_at', '>', Carbon::now())
            ->whereBetween('distance', $range)
            ->whereHas('cargo', function ($q) use($cargo) {
                $q->where('contract_type_id', ContractType::Cargo)
                    ->where('cargo_qty', '<=', $cargo);
            })->get();

        $contracts = $paxContracts->merge($cargoContracts);

        return $contracts->all();

    }
}
