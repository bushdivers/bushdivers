<?php

namespace App\Services;

use App\Models\Award;
use App\Models\Enums\AwardType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AwardService
{
    public function checkAwards($userId)
    {
        $awards = Award::all();
        $user = User::find($userId);
        $currentAwards = DB::table('award_user')->where('user_id', $userId)->get();

        foreach ($awards as $award) {
            $awardAchieved = $currentAwards->contains('award_id', $award->id);
            switch ($award->type) {
                case AwardType::HOURS:
                    if ($user->flights_time >= $award->value && !$awardAchieved) {
                        $this->addAwardToUser($userId, $award->id);
                    }
                    break;
                case AwardType::MONTHS:
                    if ($user->created_at->diffInMonths(Carbon::now()) >= $award->value && !$awardAchieved) {
                        $this->addAwardToUser($userId, $award->id);
                    }
                    break;
                case AwardType::FLIGHTS:
                    if ($user->flights >= $award->value && !$awardAchieved) {
                        $this->addAwardToUser($userId, $award->id);
                    }
                    break;
            }
        }
    }

    public function addAwardToUser($userId, $awardId)
    {
        DB::table('award_user')->insert([
            'user_id' => $userId,
            'award_id' => $awardId
        ]);
    }
}
