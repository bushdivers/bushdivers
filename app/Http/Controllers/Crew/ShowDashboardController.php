<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\Rank;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $user = User::find(Auth::user()->id);
        $lastFlight = Pirep::with('aircraft', 'aircraft.fleet', 'depAirport', 'arrAirport')
            ->where('user_id', $user->id)
            ->where('state', PirepState::ACCEPTED)
            ->orderBy('submitted_at', 'desc')
            ->first();

        $rank = Rank::find($user->rank_id);
        $nextRank = Rank::find($user->rank_id + 1);

        $locations = DB::table('airports')
            ->join('pireps', 'airports.identifier', '=', 'pireps.destination_airport_id')
            ->select('airports.identifier', 'airports.name', 'airports.lon', 'airports.lat')
            ->where('pireps.user_id', Auth::user()->id)
            ->distinct()
            ->get();

        $balance = DB::table('user_accounts')
            ->where('user_id', Auth::user()->id)
            ->sum('total');

        return Inertia::render('Crew/Dashboard', [
            'user' => $user,
            'lastFlight' => $lastFlight,
            'rank' => $rank,
            'nextRank' => $nextRank,
            'awards' => $user->awards,
            'locations' => $locations,
            'balance' => $balance
        ]);
    }
}
