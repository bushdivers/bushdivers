<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\ContractCargo;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Rental;
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
    )
    {
        $this->calcCargoWeight = $calcCargoWeight;
        $this->calcPassengerCount = $calcPassengerCount;
        $this->calcFuelWeight = $calcFuelWeight;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        // check for existing Pirep
        $pirep = Pirep::where('user_id', Auth::user()->id)
            ->whereNotIn('state', [PirepState::ACCEPTED, PirepState::REVIEW])
            ->first();

        if ($pirep) {
            $pc = PirepCargo::where('pirep_id', $pirep->id)->pluck('contract_cargo_id');

            $cargo = ContractCargo::with('contract')
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

        $cargo = $this->getCargoForDispatch(Auth::user()->current_airport_id, Auth::user()->id);
//        $aircraft = Aircraft::with('fleet')->find($pirep->aircraft_id);
        $aircraft = $this->getAircraftForDispatch(Auth::user()->current_airport_id);

        return Inertia::render('Dispatch/Dispatch', ['cargo' => $cargo, 'aircraft' => $aircraft]);
    }

    protected function getCargoForDispatch($currentLocation, $userId): Collection
    {
        return ContractCargo::with('currentAirport', 'contract', 'contract.depAirport', 'contract.arrAirport')
            ->where('current_airport_id', $currentLocation)
            ->where('is_completed', false)
            ->whereHas('contract', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->where('is_completed', false);
            })->get();
    }

    protected function getAircraftForDispatch($currentLocation): Collection
    {
        $fleetAc = Aircraft::with('fleet')
            ->where('state', AircraftState::AVAILABLE)
            ->where('status', AircraftStatus::ACTIVE)
            ->where('current_airport_id', $currentLocation)
            ->where('owner_id', 0)
            ->get();

        $rentalAc = Rental::with('fleet')
            ->where('user_id', Auth::user()->id)
            ->where('is_active', true)
            ->where('current_airport_id', $currentLocation)
            ->get();

        $privateAc = Aircraft::with('fleet')
            ->where('owner_id', Auth::user()->id)
            ->where('current_airport_id', $currentLocation)
            ->get();

        return collect($fleetAc)->merge($rentalAc)->merge($privateAc);
    }
}
