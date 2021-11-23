<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAddAircraft;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AddAircraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(AdminAddAircraft $request): RedirectResponse
    {
        $aircraft = new Aircraft();
        $aircraft->fleet_id = $request->fleet;
        $aircraft->current_airport_id = $request->hub;
        $aircraft->registration = $request->registration;
        $aircraft->state = AircraftState::AVAILABLE;
        $aircraft->status = AircraftStatus::ACTIVE;
        $aircraft->save();

        return redirect()->route('admin.fleet')->with(['success' => 'Aircraft created']);
    }
}
