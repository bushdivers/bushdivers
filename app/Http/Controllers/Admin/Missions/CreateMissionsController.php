<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Services\Hubs\GenerateHubCargo;
use Illuminate\Http\Request;

class CreateMissionsController extends Controller
{
    public function __construct(
        protected GenerateHubCargo $generateHubCargo
    ) {
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_hub_event' => 'required|boolean',
            'hub_airport_icao' => 'nullable|required_if:is_hub_event,true|string|exists:airports,identifier',
        ]);

        $hubAirport = null;
        if ($validated['is_hub_event']) {
            $hubAirport = Airport::base()->where('identifier', $validated['hub_airport_icao'])->first();
            if (! $hubAirport || $hubAirport->is_hub) {
                return redirect()->back()->with('error', 'Invalid hub airport selected. Airport must be a non-hub base airport.');
            }
        }

        $mission = new CommunityJob();
        $mission->name = $validated['name'];
        $mission->description = '';
        $mission->allow_private = false;
        $mission->hub_airport_id = $hubAirport?->id;
        $mission->save();

        if ($hubAirport) {
            $this->generateHubCargo->execute($mission, $hubAirport);
        }

        return redirect()->route('admin.mission.details', $mission->id);
    }
}
