<?php

namespace App\Services\Awards;

use App\Models\Award;
use App\Models\Enums\AwardType;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CheckAwardStatus
{
    protected AddAwardToUser $addAwardToUser;

    public function __construct(AddAwardToUser $addAwardToUser)
    {
        $this->addAwardToUser = $addAwardToUser;
    }

    public function execute($userId)
    {
        $awards = Award::all();
        $user = User::find($userId);
        $currentAwards = DB::table('award_user')->where('user_id', $userId)->get();

        foreach ($awards as $award) {
            $awardAchieved = $currentAwards->contains('award_id', $award->id);
            switch ($award->type) {
                case AwardType::HOURS:
                    if ($user->flights_time / 60 >= $award->value && !$awardAchieved) {
                        $this->addAwardToUser->execute($userId, $award->id);
                    }
                    break;
                case AwardType::MONTHS:
                    if ($user->created_at->diffInMonths(Carbon::now()) >= $award->value && !$awardAchieved) {
                        $this->addAwardToUser->execute($userId, $award->id);
                    }
                    break;
                case AwardType::FLIGHTS:
                    if ($user->flights >= $award->value && !$awardAchieved) {
                        $this->addAwardToUser->execute($userId, $award->id);
                    }
                    break;
                case AwardType::DISTANCE:
                    $distance = Pirep::where('user_id', $userId)
                        ->where('state', PirepState::ACCEPTED)
                        ->sum('distance');
                    if ($distance > $award->value && !$awardAchieved) {
                        $this->addAwardToUser->execute($userId, $award->id);
                    }
                    break;
                case AwardType::AIRPORTS:
                    $airports = DB::table('pireps')
                        ->where('user_id', $userId)
                        ->where('state', PirepState::ACCEPTED)
                        ->distinct()
                        ->count('destination_airport_id');
                    if ($airports > $award->value && !$awardAchieved) {
                        $this->addAwardToUser->execute($userId, $award->id);
                    }
                    break;
            }
        }
    }
}
