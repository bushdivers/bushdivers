<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\CargoType;
use App\Models\Contract;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Rental;
use App\Models\Tour;
use App\Models\TourUser;
use App\Services\Dispatch\CalcCargoWeight;
use App\Services\Dispatch\CalcFuelWeight;
use App\Services\Dispatch\CalcPassengerCount;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowDispatchController extends Controller
{
    protected CalcCargoWeight $calcCargoWeight;
    protected CalcPassengerCount $calcPassengerCount;
    protected CalcFuelWeight $calcFuelWeight;

    public function __construct(
        CalcCargoWeight $calcCargoWeight,
        CalcPassengerCount $calcPassengerCount,
        CalcFuelWeight $calcFuelWeight
    ) {
        $this->calcCargoWeight = $calcCargoWeight;
        $this->calcPassengerCount = $calcPassengerCount;
        $this->calcFuelWeight = $calcFuelWeight;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        /** @var Pirep|null $pirep */
        $pirep = Pirep::with(['tour', 'variant', 'depAirport', 'arrAirport'])
            ->where('user_id', Auth::user()->id)
            ->whereNotIn('state', [PirepState::ACCEPTED, PirepState::REVIEW])
            ->first();

        if ($pirep) {
            $pc = PirepCargo::where('pirep_id', $pirep->id)->pluck('contract_cargo_id');

            $cargo = Contract::with(['currentAirport', 'arrAirport'])
                ->whereIn('id', $pc)
                ->get();

            //            $cargo = $this->getCargoForActiveDispatch($pc);
            if ($pirep->is_rental) {
                $aircraft = Rental::with('fleet')->find($pirep->aircraft_id);
            } else {
                $aircraft = Aircraft::with('fleet')->find($pirep->aircraft_id);
            }

            $cargoWeight = $this->calcCargoWeight->execute($cargo);
            $passengerCount = $this->calcPassengerCount->execute($cargo);
            $fuelWeight = $this->calcFuelWeight->execute($aircraft->fleet->fuel_type, $pirep->planned_fuel);

            return Inertia::render('Dispatch/ActiveDispatch', [
                'cargo' => $cargo,
                'aircraft' => $aircraft,
                'cargoWeight' => $cargoWeight,
                'passengerCount' => $passengerCount,
                'fuelWeight' => $fuelWeight,
                'pirep' => $pirep
            ]);
        }

        $currentAirport = Airport::findOrFail(Auth::user()->current_airport_id);

        $cargo = $this->getCargoForDispatch($currentAirport, Auth::user()->id);
        $aircraft = $this->getAircraftForDispatch($currentAirport);
        $tours = Tour::with('aircraft.fleet')
            ->whereHas('participants', function ($q) {
                return $q->where('user_id', Auth::user()->id)->where('is_completed', false);
            })
            ->get();

        // Supply last pirep for new flight prefill if we're still at that location
        $lastPirep = Auth::user()->latestPirep()->with('depAirport')->first();
        if ($lastPirep && Auth::user()->current_airport_id != $lastPirep->arrival_airport_id) {
            $lastPirep = null;
        }

        $suggestions = $this->buildSuggestions($currentAirport, $lastPirep, $tours, Auth::user()->id);

        return Inertia::render('Dispatch/Dispatch', ['cargo' => $cargo, 'aircraft' => $aircraft, 'airport' => $currentAirport, 'tours' => $tours, 'lastPirep' => $lastPirep, 'suggestions' => $suggestions]);
    }

    protected function getCargoForDispatch(Airport $currentLocation, $userId): array
    {
        $minSplits = CargoType::pluck('min_cargo_split', 'text');

        $cargoAtAirport = Contract::with('arrAirport', 'communityJobContract.communityJob')
            ->where('current_airport_id', $currentLocation->id)
            ->where('is_completed', false)
            ->where(function ($q) use ($userId) {
                $q->where('is_shared', true)
                    ->orWhere('user_id', $userId);
            })
            ->orderBy('heading', 'asc')
            ->orderBy('arr_airport_id', 'asc')
            ->get()
            ->map(function (Contract $contract) use ($minSplits) {
                $contract = $contract->toArray();
                $contract['min_cargo_split'] = $minSplits->get($contract['cargo'], 1);
                return $contract;
            });

        $cargoElsewhere = Contract::with('currentAirport', 'arrAirport')
            ->where('current_airport_id', '<>', $currentLocation->id)
            ->where('is_completed', false)
            ->where(function ($q) use ($userId) {
                $q->where('is_shared', true)
                    ->orWhere('user_id', $userId);
            })
            ->where('active_pirep', null)
            ->orderBy('heading')
            ->orderBy('arr_airport_id')
            ->get();

        return ['cargoAtAirport' => $cargoAtAirport, 'cargoElsewhere' => $cargoElsewhere];
    }

    protected function getAircraftForDispatch(Airport $currentLocation): Collection
    {
        $aircraft = Aircraft::with(['fleet.variants', 'engines'])
            ->where('state', AircraftState::AVAILABLE)
            ->where('status', AircraftStatus::ACTIVE)
            ->where('current_airport_id', $currentLocation->id)
            ->where(function ($baseQ) {
                $baseQ->where(fn ($q) => $q->where('owner_id', 0)->where('is_ferry', false)) // fleet
                    ->orWhere(fn ($q) => $q->where('owner_id', 0)->where('is_ferry', true)->where('ferry_user_id', Auth::user()->id)) // ferry
                    ->orWhere(fn ($q) => $q->where('owner_id', Auth::user()->id)); // private
            })->get();

        $rentalAc = Rental::with('fleet.variants')
            ->where('user_id', Auth::user()->id)
            ->where('is_active', true)
            ->where('current_airport_id', $currentLocation->id)
            ->get();

        return $aircraft->merge($rentalAc);
    }

    protected function buildSuggestions(Airport $currentAirport, ?Pirep $lastPirep, $tours, $userId): array
    {
        $suggestions = [];

        // Previous departure airport
        if ($lastPirep && $lastPirep->depAirport && $lastPirep->depAirport->id !== $currentAirport->id) {
            $suggestions[] = [
                'type' => 'previous',
                'identifier' => $lastPirep->depAirport->identifier,
                'name' => $lastPirep->depAirport->name,
            ];
        }

        // Nearest hub
        $nearestHub = Airport::hub()
            ->forUser(Auth::user())
            ->withRangeTo($currentAirport)
            ->where('id', '!=', $currentAirport->id)
            ->orderBy('distance')
            ->first();
        if ($nearestHub) {
            $suggestions[] = [
                'type' => 'hub',
                'identifier' => $nearestHub->identifier,
                'name' => $nearestHub->name,
            ];
        }

        // Tour next checkpoints
        if ($tours->isNotEmpty()) {
            $tourUsers = TourUser::where('user_id', $userId)
                ->whereIn('tour_id', $tours->pluck('id'))
                ->whereNotNull('next_airport_id')
                ->with('nextAirport')
                ->get();
            foreach ($tourUsers as $tu) {
                if ($tu->nextAirport) {
                    $suggestions[] = [
                        'type' => 'tour',
                        'tour_id' => $tu->tour_id,
                        'identifier' => $tu->nextAirport->identifier,
                        'name' => $tu->nextAirport->name,
                    ];
                }
            }
        }

        // Nearest fuel — only when current airport has no permanent fuel facilities
        if (!$currentAirport->has_avgas && !$currentAirport->has_jetfuel) {
            $nearestFuel = Airport::where(function ($q) {
                $q->where('has_avgas', true)->orWhere('has_jetfuel', true);
            })
                ->withRangeTo($currentAirport)
                ->where('id', '!=', $currentAirport->id)
                ->orderBy('distance')
                ->limit(3)
                ->get();
            foreach ($nearestFuel as $ap) {
                $suggestions[] = [
                    'type' => 'fuel',
                    'identifier' => $ap->identifier,
                    'name' => $ap->name,
                ];
            }
        }

        return $suggestions;
    }
}
