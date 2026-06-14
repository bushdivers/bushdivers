<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\CommunityJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowCommunityController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Find active mission (either regular mission or hub event)
        $mission = CommunityJob::with(['jobs', 'jobs.departureAirport', 'jobs.arrivalAirport'])
            ->where('is_published', 1)
            ->where('is_completed', 0)
            ->first();

        $hub = null;

        if ($mission) {
            // If this mission is a hub event, fetch hub airport data
            if ($mission->hub_airport_id) {
                $hub = Airport::with(['ferryFlights' => function ($query) {
                    $query->where('is_ferry', true);
                }, 'ferryFlights.fleet', 'ferryFlights.location', 'ferryFlights.engines'])
                ->where('id', $mission->hub_airport_id)
                ->first();
            }

            // For all missions (hub or regular), load available fleet
            /*$fleet = Aircraft::where('owner_id', 0)->with(['fleet' => function ($q) {
                $q->orderBy('type', 'asc');
            }, 'location', 'engines'])
                ->withAggregate('location', 'identifier')
                ->orderBy('location_identifier', 'asc')
                ->orderBy('fleet_id', 'asc')
                ->get();*/
        }

        return Inertia::render('Community/Jobs', ['hub' => $hub, 'mission' => $mission]);
    }
}
