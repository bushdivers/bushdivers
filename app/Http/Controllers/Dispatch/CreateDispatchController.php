<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\PirepState;
use App\Models\Enums\TransactionTypes;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Rental;
use App\Services\Airports\UpdateFuelAtAirport;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Ramsey\Uuid\Uuid;

class CreateDispatchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, UpdateFuelAtAirport $updateFuelAtAirport, AddUserTransaction $addUserTransaction, AddAirlineTransaction $addAirlineTransaction): RedirectResponse
    {
        // check aircraft is available
        $isRental = false;
        $aircraft = Aircraft::with('fleet')->where('registration', $request->aircraft)->first();

        if (!$aircraft) {
            $aircraft = Rental::with('fleet')->where('registration', $request->aircraft)->first();
            $isRental = true;
        } elseif ($aircraft->user_id != null && $aircraft->state == 2) {
            return redirect()->back()->with(['error' => 'Aircraft is part of another flight dispatch']);
        }

        // create draft pirep with destination and detail
        $pirep = new Pirep();
        $pirep->id = Uuid::uuid4();
        $pirep->user_id = Auth::user()->id;
        $pirep->aircraft_id = $aircraft->id;
        $pirep->departure_airport_id = Auth::user()->current_airport_id;
        $pirep->destination_airport_id = $request->destination;
        $pirep->planned_fuel = $request->fuel;
        $pirep->state = PirepState::DISPATCH;
        $pirep->is_empty = $request->is_empty;
        $pirep->is_rental = $isRental;
        $pirep->tour_id = $request->tour;
        $pirep->save();

        if (!$request->is_empty) {
            // add contract cargo to pirep_cargos
            foreach ($request->cargo as $cargo) {
                $contract = Contract::find($cargo);

                // Prevent assigning contracts that don't exist
                if (!$contract)
                    continue;

                $pirepCargo = new PirepCargo();
                $pirepCargo->contract_cargo_id = $cargo;
                $pirepCargo->pirep_id = $pirep->id;
                $pirepCargo->save();

                $contract->is_available = false;
                $contract->user_id = Auth::user()->id;
                $contract->active_pirep = $pirep->id;
                $contract->save();
            }
        }


        $actualFuelAdded = $request->fuel - $aircraft->fuel_onboard;
        if ($actualFuelAdded > 0) {
            // charge fuel
            if ($isRental) {
                $addUserTransaction->execute(Auth::user()->id, TransactionTypes::FlightFeesFuel, -$request->fuel_price);
            } elseif ($aircraft->owner_id != 0) {
                $addUserTransaction->execute(Auth::user()->id, TransactionTypes::FlightFeesFuel, -$request->fuel_price);
            } else {
                $addAirlineTransaction->execute(AirlineTransactionTypes::FuelFees, -$request->fuel_price, 'Fuel '.$actualFuelAdded.' at '.Auth::user()->current_airport_id, null, 'debit');
            }
            // decrement fuel from airport
            $updateFuelAtAirport->execute(Auth::user()->current_airport_id, $actualFuelAdded, $aircraft->fleet->fuel_type, 'decrement');
        }

        // update aircraft for user and fuel
        if (!$isRental) {
            $aircraft->fuel_onboard = $request->fuel;
            $aircraft->user_id = Auth::user()->id;
            $aircraft->state = AircraftState::BOOKED;
            $aircraft->save();
        } else {
            $aircraft->fuel_onboard = $request->fuel;
            $aircraft->save();
        }

        return redirect()->back()->with(['success' => 'Dispatch created successfully']);
    }
}
