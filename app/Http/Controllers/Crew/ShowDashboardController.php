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

        $lastFlightQ = Pirep::where('user_id', $user->id)
            ->where('state', PirepState::ACCEPTED)
            ->orderBy('submitted_at', 'desc')
            ->first();

        if ($lastFlightQ->is_rental) {
            $lastFlight = Pirep::with('rental', 'rental.fleet', 'depAirport', 'arrAirport')
                ->where('user_id', $user->id)
                ->where('state', PirepState::ACCEPTED)
                ->orderBy('submitted_at', 'desc')
                ->first();
        } else {
            $lastFlight = Pirep::with('aircraft', 'aircraft.fleet', 'depAirport', 'arrAirport')
                ->where('user_id', $user->id)
                ->where('state', PirepState::ACCEPTED)
                ->orderBy('submitted_at', 'desc')
                ->first();
        }

        $locations = DB::table('airports')
            ->join('pireps', 'airports.identifier', '=', 'pireps.destination_airport_id')
            ->select('airports.identifier', 'airports.name', 'airports.lon', 'airports.lat')
            ->where('pireps.user_id', Auth::user()->id)
            ->distinct()
            ->get();

        return Inertia::render('Crew/Dashboard', [
            'user' => $user,
            'lastFlight' => $lastFlight,
            'locations' => $locations,
        ]);
    }
}
