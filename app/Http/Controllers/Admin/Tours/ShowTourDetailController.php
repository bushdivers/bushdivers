<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowTourDetailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tour = Tour::with('aircraft.fleet', 'checkpoints.airport')->find($request->id);
        $fleet = Fleet::whereNotIn('id', $tour->aircraft->pluck('fleet_id'))->get();
        return Inertia::render('Admin/TourDetail', ['tour' => $tour, 'fleet' => $fleet]);
    }
}
