<?php

namespace App\Http\Controllers\Tours;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\TourCheckpoint;
use App\Models\TourCheckpointUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShowTourController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // get list of tours
        $tour = Tour::with(['startingAirport', 'checkpoints.airport', 'participants.user', 'aircraft.fleet'])
            ->where('id', $request->id)
            ->first();
        $checkpoints = $tour->checkpoints->sortBy('section')->values()->all();
        $userCheckpoints = null;
        if ($tour->participants->contains('user_id', Auth::user()->id)) {
            $userCheckpoints = TourCheckpointUser::with('airport')->where('tour_id', $tour->id)->where('user_id', Auth::user()->id)->orderBy('section')->get();
        }
        return Inertia::render('Tours/TourDetails', ['tour' => $tour, 'checkpoints' => $checkpoints, 'userCheckpoints' => $userCheckpoints]);
    }
}
