<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\ContractCargo;
use App\Models\Enums\AircraftState;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Rental;
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
    public function __invoke(Request $request): RedirectResponse
    {
        // check aircraft is available
        $isRental = false;
        $aircraft = Aircraft::where('registration', $request->aircraft)->first();

        if (!$aircraft) {
            $aircraft = Rental::where('registration', $request->aircraft)->first();
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
        $pirep->save();

        if (!$request->is_empty) {
            // add contract cargo to pirep_cargos
            foreach ($request->cargo as $cargo) {
                $pirepCargo = new PirepCargo();
                $pirepCargo->contract_cargo_id = $cargo;
                $pirepCargo->pirep_id = $pirep->id;
                $pirepCargo->save();

                $contractCargo = ContractCargo::find($cargo);
                $contractCargo->is_available = false;
                $contractCargo->user_id = Auth::user()->id;
                $contractCargo->active_pirep = $pirep->id;
                $contractCargo->save();
            }
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
