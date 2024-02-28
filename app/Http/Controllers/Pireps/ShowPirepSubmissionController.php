<?php

namespace App\Http\Controllers\Pireps;

use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowPirepSubmissionController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $pirep = Pirep::where('user_id', Auth::user()->id)
            ->whereIn('state', [PirepState::DISPATCH, PirepState::IN_PROGRESS])
            ->firstOrFail();
        return Inertia::render('Pireps/Submission', ['pirep' => $pirep]);
    }
}
