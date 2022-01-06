<?php

namespace App\Http\Controllers\Pireps;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowLogbookController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $logbook = Pirep::with('depAirport', 'arrAirport')
            ->where('user_id', Auth::user()->id)
            ->whereIn('state', [PirepState::ACCEPTED, PirepState::REVIEW])
            ->orderBy('submitted_at', 'desc')
            ->paginate(10);


        return Inertia::render('Crew/Logbook', ['logbook' => $logbook]);
    }
}
