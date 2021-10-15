<?php

namespace App\Http\Controllers;

use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\ContractCargo;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Services\DispatchService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Ramsey\Uuid\Uuid;

class DispatchController extends Controller
{
    protected DispatchService $dispatchService;

    public function __construct(DispatchService $dispatchService)
    {
        $this->dispatchService = $dispatchService;
    }

    public function index(): Response
    {
        // check for existing Pirep
        $pirep = Pirep::where('user_id', Auth::user()->id)
            ->where('state', '<>', PirepState::ACCEPTED)
            ->first();

        if ($pirep) {
            $pc = PirepCargo::where('pirep_id', $pirep->id)->pluck('contract_cargo_id');

            $cargo = ContractCargo::with('contract')
                ->whereIn('id', $pc)
                ->get();

//            $cargo = $this->getCargoForActiveDispatch($pc);
            $aircraft = $this->getAircraftForActiveDispatch($pirep->aircraft_id);

            $cargoWeight = $this->dispatchService->calculateCargoWeight($cargo);
            $passengerCount = $this->dispatchService->calculatePassengerCount($cargo);
            $fuelWeight = $this->dispatchService->calculateFuelWeight($aircraft->fleet->fuel_type, $pirep->planned_fuel);

            return Inertia::render('Dispatch/ActiveDispatch', [
                'cargo' => $cargo,
                'aircraft' => $aircraft,
                'cargoWeight' => $cargoWeight,
                'passengerCount' => $passengerCount,
                'fuelWeight' => $fuelWeight,
                'pirep' => $pirep
            ]);
        }

        $cargo = $this->getCargoForDispatch(Auth::user()->current_airport_id, Auth::user()->id);
        $aircraft = $this->getAircraftForDispatch(Auth::user()->current_airport_id);

        return Inertia::render('Dispatch/Dispatch', ['cargo' => $cargo, 'aircraft' => $aircraft]);
    }

    public function create(Request $request): RedirectResponse
    {
        // create draft pirep with destination and detail
        $pirep = new Pirep();
        $pirep->id = Uuid::uuid4();
        $pirep->user_id = Auth::user()->id;
        $pirep->aircraft_id = $request->aircraft;
        $pirep->departure_airport_id = Auth::user()->current_airport_id;
        $pirep->destination_airport_id = $request->destination;
        $pirep->planned_fuel = $request->fuel;
        $pirep->state = PirepState::DISPATCH;
        $pirep->is_empty = $request->is_empty;
        $pirep->save();

        if (!$request->is_empty) {
            // add contract cargo to pirep_cargos
            foreach ($request->cargo as $cargo) {
                $pirepCargo = new PirepCargo();
                $pirepCargo->contract_cargo_id = $cargo;
                $pirepCargo->pirep_id = $pirep->id;
                $pirepCargo->save();
            }
        }

        // update aircraft for user and fuel
        $aircraft = Aircraft::find($request->aircraft);
        $aircraft->fuel_onboard = $request->fuel;
        $aircraft->user_id = Auth::user()->id;
        $aircraft->state = AircraftState::BOOKED;
        $aircraft->save();

//        // get cargo and destination linked to pirep
//        $dispatchedCargo = `$this`->getCargoForActiveDispatch($request->cargo);
//        // get aircraft and fuel for dispatched flight
//        $aircraft = $this->getAircraftForActiveDispatch($aircraft->id);
//        return Inertia::render('Dispatch/ActiveDispatch', ['cargo' => $dispatchedCargo, 'aircraft' => $aircraft]);

        return redirect()->back()->with(['success' => 'Dispatch created successfully']);
    }

    public function cancel(Request $request): RedirectResponse
    {
        $pirep = Pirep::find($request->pirep);

        if ($pirep->state == PirepState::ACCEPTED || $pirep->state == PirepState::REJECTED) {
            return redirect()->back()->with(['error' => 'Flight already completed']);
        }

        // clear up aircraft assignment
        $aircraft = Aircraft::find($pirep->aircraft_id);
        $aircraft->state = AircraftState::AVAILABLE;
        $aircraft->user_id = null;
        $aircraft->save();

        // remove pirep cargo entries
        PirepCargo::where('pirep_id', $pirep->id)->delete();

        FlightLog::where('pirep_id', $pirep->id)->delete();

        // remove draft pirep
        $pirep->delete();

        return redirect()->back()->with(['success' => 'Dispatch cancelled successfully']);
    }

    protected function getCargoForDispatch($currentLocation, $userId): Collection
    {
        return ContractCargo::with('currentAirport', 'contract', 'contract.depAirport', 'contract.arrAirport')
            ->where('current_airport_id', $currentLocation)
            ->where('is_completed', false)
            ->whereHas('contract', function ($q) use($userId) {
                $q->where('user_id', $userId)
                    ->where('is_completed', false);
            })->get();
    }

    protected function getAircraftForDispatch($currentLocation): Collection
    {
        return Aircraft::with('fleet')
            ->where('state', AircraftState::AVAILABLE)
            ->where('status', AircraftStatus::ACTIVE)
            ->where('current_airport_id', $currentLocation)
            ->get();
    }

    protected function getCargoForActiveDispatch($ids): Collection
    {
        ContractCargo::with('contract')
            ->whereIn('id', $ids)
            ->get();
    }

    protected function getAircraftForActiveDispatch($id): Model
    {
        return Aircraft::with('fleet')->find($id);
    }
}
