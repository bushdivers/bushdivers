<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Tour;
use Illuminate\Http\Request;

class EditTourController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $startAirport = Airport::where('identifier', $request->start)->first();
        if (!$startAirport) {
            return redirect()->back()->with(['error' => 'Invalid starting airport identifier']);
        }

        $tour = Tour::find($request->id);
        $tour->title = $request->title;
        $tour->description = $request->description;
        if (!$tour->is_published)
            $tour->start_airport_id = $startAirport->id;
        $tour->save();
        return redirect()->back()->with(['success' => 'Tour updated.']);
    }
}
