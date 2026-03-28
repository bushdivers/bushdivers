<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RenameAirportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $newIcao = $request->newIcao ?? '';

        if (strlen($newIcao) < 2) {
            return redirect()->back()->with(['error' => 'You must enter a new ICAO code']);
        } elseif (strlen($newIcao) > 5) {
            return redirect()->back()->with(['error' => 'ICAO code must be less than 6 characters']);
        }

        if (Airport::where('identifier', $newIcao)->count() > 0) {
            return redirect()->back()->with(['error' => 'ICAO code already exists']);
        }

        $airport = Airport::where('identifier', $request->airport)->first();
        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        if (Pirep::whereNotIn('state', [PirepState::ACCEPTED, PirepState::REVIEW])
            ->where(function ($q) use ($airport) {
                $q->where('departure_airport_id', $airport->id)->orWhere('arrival_airport_id', $airport->id);
            })
            ->first()) {
            return redirect()->back()->with(['error' => 'Cannot rename airport with active PIREPs']);
        }

        $newIcao = strtoupper($newIcao);

        $airport->identifier = $newIcao;
        $airport->save();

        return redirect('airports/'.$newIcao)->with(['success' => 'Airport renamed']);
    }
}
