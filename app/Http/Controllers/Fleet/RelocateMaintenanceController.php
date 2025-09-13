<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AircraftState;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;


class RelocateMaintenanceController extends Controller
{
    public function __construct(
    )
    {
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $aircraft = Aircraft::find($request->aircraft);

        if (!$aircraft || $aircraft->state != AircraftState::AVAILABLE)
            return redirect()->back()->with(['error' => 'Unable to move - aircraft in use']);

        $destination = Airport::where('identifier', strtoupper($request->dest))->first();
        if (!$destination)
            return redirect()->back()->with(['error' => 'Unable to move - destination not found']);

        $aircraft->current_airport_id = $destination->id;
        $aircraft->last_lat = $destination->lat;
        $aircraft->last_lon = $destination->lon;

        if ($aircraft->save())
            return redirect()->back()->with(['success' => 'Aircraft relocated successfully']);
        else
            return redirect()->back()->with(['error' => 'Error moving aircraft']);
    }
}
