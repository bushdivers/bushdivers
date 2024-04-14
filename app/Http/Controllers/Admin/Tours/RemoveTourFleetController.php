<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\TourAircraft;
use Illuminate\Http\Request;

class RemoveTourFleetController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke($tour, $fleet)
    {
        $tourAircraft = TourAircraft::where('tour_id', $tour)->where('fleet_id', $fleet)->first();
        $tourAircraft->delete();
        return redirect()->back()->with(['success' => 'Fleet removed from tour']);
    }
}
