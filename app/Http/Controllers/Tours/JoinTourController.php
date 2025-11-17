<?php

namespace App\Http\Controllers\Tours;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\TourCheckpointUser;
use App\Models\TourUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JoinTourController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tour = Tour::with('checkpoints')->where('id', $request->id)->first();
        // add user to tour
        $initialCheckpoint = $tour->checkpoints->sortBy('section')->first();
        TourUser::create([
            'tour_id' => $tour->id,
            'user_id' => Auth::user()->id,
            'next_airport_id' => $initialCheckpoint->checkpoint_airport_id
        ]);
        // add user checkpoints
        foreach ($tour->checkpoints as $checkpoint) {
            TourCheckpointUser::create([
                'tour_id' => $tour->id,
                'user_id' => Auth::user()->id,
                'section' => $checkpoint->section,
                'checkpoint_airport_id' => $checkpoint->checkpoint_airport_id
            ]);
        }
        return redirect()->back()->with('success', 'You have joined ' . $tour->title);
    }
}
