<?php

namespace App\Http\Controllers\Aircraft;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAircraftHubController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Aircraft $aircraft): RedirectResponse
    {
        $user = $request->user();

        if (!$user
            || ($aircraft->owner_id === 0 && !$user->hasRole('fleet_manager'))
            || ($aircraft->owner_id !== 0 && $aircraft->owner_id !== $user->id)) {
            return redirect()->back()->with(['error' => 'You do not own this aircraft']);
        }

        $airport = Airport::query()->where('identifier', strtoupper($request->string('hub')->toString()))->first();

        if (!$airport) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

        $aircraft->hub_id = $airport->id;
        $aircraft->save();

        return redirect()->back()->with(['success' => 'Aircraft hub updated']);
    }
}
