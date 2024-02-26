<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\Rank;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowProfileController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $user = Auth::user();
        $user->makeVisible(['email', 'api_token', 'name']);

        $rank = Rank::find($user->rank_id);
        $nextRank = Rank::find($user->rank_id + 1);

        if ($user->api_token == null) {
            $token = $user->createToken('bush-tracker');
            $user->api_token = $token->plainTextToken;
            $user->save();
        }

        return Inertia::render('Crew/Profile', [
            'profile' => $user,
            'rank' => $rank,
            'nextRank' => $nextRank,
            'awards' => $user->awards
        ]);
    }
}
