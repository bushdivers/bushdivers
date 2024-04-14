<?php

namespace App\Services\Tours;

use App\Models\Pirep;
use App\Models\Tour;
use App\Models\TourCheckpointUser;
use App\Models\TourUser;
use App\Services\Awards\AddAwardToUser;
use Carbon\Carbon;

class CheckTourProgress
{
    protected AddAwardToUser $addAwardToUser;

    public function __construct(AddAwardToUser $addAwardToUser)
    {
        $this->addAwardToUser = $addAwardToUser;
    }

    public function execute(Pirep $pirep)
    {
        // get tour
        $tour = Tour::find($pirep->tour_id);
        $tourUser = TourUser::where('user_id', $pirep->user_id)->where('tour_id', $pirep->tour_id)->first();

        if ($pirep->destination_airport_id == $tourUser->next_checkpoint) {
            $tourUserCheckpoints = TourCheckpointUser::where('user_id', $pirep->user_id)
                ->where('tour_id', $pirep->tour_id)
                ->get();

            // get user next checkpoint

            // set checkpoint as completed
            $flightCheckpoint = TourCheckpointUser::where('user_id', $pirep->user_id)
                ->where('tour_id', $pirep->tour_id)
                ->where('checkpoint', $pirep->destination_airport_id)
                ->first();
            $flightCheckpoint->is_completed = true;
            $flightCheckpoint->completed_at = Carbon::now();
            $flightCheckpoint->save();

            $nextCheckpoint = TourCheckpointUser::where('user_id', $pirep->user_id)->where('is_completed', false)->where('tour_id', $pirep->tour_id)->orderBy('section')->first();
            if ($nextCheckpoint) {
                $tourUser->next_checkpoint = $nextCheckpoint->checkpoint;
            } else {
                // completed tour
                $tourUser->is_completed = true;
                $tourUser->completed_at = Carbon::now();
                $this->addAwardToUser->execute($pirep->user_id, $tour->award_id);
            }

            // update user tour progress
            $userCompleted = TourCheckpointUser::where('user_id', $pirep->user_id)->where('is_completed', true)->where('tour_id', $pirep->tour_id)->count();
            $progress = ($userCompleted / $tourUserCheckpoints->count()) * 100;

            $tourUser->progress = $progress;
            $tourUser->save();
        }
    }
}
