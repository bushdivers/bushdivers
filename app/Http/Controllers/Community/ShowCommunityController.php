<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowCommunityController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // current community jobs
        // hubs
        $hub = Airport::with(['hubContracts' => function($query) {
                $query->where('contract_type_id', 5);
            },
            'ferryFlights' => function($query) {
                $query->where('is_ferry', true);
            }, 'ferryFlights.fleet'])
        ->where('is_hub', true)
        ->where('hub_in_progress', true)
        ->first();

        $mission  = CommunityJob::with('jobs')->where('is_published', 1)->where('is_completed', 0)->first();
        $fleet = null;
        if ($mission) {
            $fleet = Aircraft::where('owner_id', 0)->with(['fleet' => function($q) {
                $q->orderBy('type', 'asc');
            }])
                ->orderBy('current_airport_id', 'asc')
                ->orderBy('fleet_id', 'asc')
                ->get();
        }
        return Inertia::render('Community/Jobs', ['hub' => $hub, 'mission' => $mission, 'fleet' => $fleet]);
    }
}
