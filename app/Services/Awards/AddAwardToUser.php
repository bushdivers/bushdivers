<?php

namespace App\Services\Awards;

use Illuminate\Support\Facades\DB;

class AddAwardToUser
{
    public function execute($userId, $awardId)
    {
        DB::table('award_user')->insert([
            'user_id' => $userId,
            'award_id' => $awardId
        ]);
    }
}
