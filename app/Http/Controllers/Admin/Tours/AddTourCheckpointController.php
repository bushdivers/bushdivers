<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\TourCheckpoint;
use Illuminate\Http\Request;

class AddTourCheckpointController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $totalCheckpoints = TourCheckpoint::where('tour_id', $request->tour)->count();
        $tourCheckpoint = new TourCheckpoint();
        $tourCheckpoint->tour_id = $request->tour;
        $tourCheckpoint->checkpoint = $request->checkpoint;
        $tourCheckpoint->section = $totalCheckpoints + 1;
        $tourCheckpoint->save();
        return redirect()->back()->with(['success' => 'Checkpoint added to tour']);
    }
}
