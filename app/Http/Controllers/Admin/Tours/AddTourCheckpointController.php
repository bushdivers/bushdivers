<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\TourCheckpoint;
use Illuminate\Http\Request;

class AddTourCheckpointController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $airport = Airport::where('identifier', $request->checkpoint)->first();
        if (!$airport) {
            return redirect()->back()->with(['error' => 'Invalid checkpoint airport identifier']);
        }

        $totalCheckpoints = TourCheckpoint::where('tour_id', $request->tour)->count();
        $tourCheckpoint = new TourCheckpoint();
        $tourCheckpoint->tour_id = $request->tour;
        $tourCheckpoint->checkpoint_airport_id = $airport->id;
        $tourCheckpoint->section = $totalCheckpoints + 1;
        $tourCheckpoint->save();
        return redirect()->back()->with(['success' => 'Checkpoint added to tour']);
    }
}
