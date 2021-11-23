<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\PirepCargo;
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
        $aircraft = Aircraft::find($request->aircraft);
        if ($aircraft->user_id != null && $aircraft->state == 2) {
            return redirect()->back()->with(['error' => 'Aircraft is part of another flight dispatch']);
        }

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
        $aircraft->fuel_onboard = $request->fuel;
        $aircraft->user_id = Auth::user()->id;
        $aircraft->state = AircraftState::BOOKED;
        $aircraft->save();

        return redirect()->back()->with(['success' => 'Dispatch created successfully']);
    }
}
