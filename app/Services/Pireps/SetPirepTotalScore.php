<?php

namespace App\Services\Pireps;

use App\Models\Pirep;
use App\Models\Point;
use App\Models\User;

class SetPirepTotalScore
{
    public function execute($pirep)
    {
        $points = Point::where('pirep_id', $pirep->id)->sum('points');
        $p = Pirep::find($pirep->id);
        $p->score = $points;
        $p->save();

        $user = User::find($pirep->user_id);
        $user->points += $points;
        $user->save();
    }
}
