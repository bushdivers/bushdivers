<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\ContractCargo;
use App\Models\Enums\AircraftState;
use App\Models\Enums\PirepState;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\PirepCargo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CancelDispatchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $pirep = Pirep::find($request->pirep);

        if ($pirep->state == PirepState::ACCEPTED || $pirep->state == PirepState::REJECTED) {
            return redirect()->back()->with(['error' => 'Flight already completed']);
        }

        // clear up aircraft assignment
        if (!$pirep->is_rental) {
            $aircraft = Aircraft::find($pirep->aircraft_id);
            $aircraft->state = AircraftState::AVAILABLE;
            $aircraft->user_id = null;
            $aircraft->save();
        }

        ContractCargo::where('user_id', Auth::user()->id)
            ->where('is_completed', false)
            ->update(['is_available' => true, 'user_id' => null, 'active_pirep' => null]);

        // remove pirep cargo entries
        PirepCargo::where('pirep_id', $pirep->id)->delete();

        FlightLog::where('pirep_id', $pirep->id)->delete();

        // remove draft pirep
        $pirep->delete();

        return redirect()->back()->with(['success' => 'Dispatch cancelled successfully']);
    }
}
