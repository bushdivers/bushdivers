<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
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
        $hubContracts = [];
        $ferry = [];
        $hubs = Airport::with(['hubContracts' => function($query) {
                $query->where('contract_type_id', 5);
            },
            'ferryFlights' => function($query) {
                $query->where('is_ferry', true);
            }, 'ferryFlights.fleet'])
        ->where('is_hub', true)
        ->where('hub_in_progress', true)
        ->get();
//        if ($hubs->count() > 0) {
//            $hubContracts = Contract::with('depAirport', 'arrAirport')
//                ->where('contract_type_id', 5)
//                ->get();
//
//            $ferry = Aircraft::with('fleet')
//                ->where('is_ferry', true)
//                ->get();
//        }
        return Inertia::render('Community/Jobs', ['hubs' => $hubs]);
    }
}
