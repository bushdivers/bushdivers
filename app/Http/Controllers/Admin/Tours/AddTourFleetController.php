<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\TourAircraft;
use Illuminate\Http\Request;

class AddTourFleetController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tourAircraft = new TourAircraft();
        $tourAircraft->tour_id = $request->tour;
        $tourAircraft->fleet_id = $request->fleet;
        $tourAircraft->save();
        return redirect()->back()->with(['success' => 'Fleet added to tour']);
    }
}
