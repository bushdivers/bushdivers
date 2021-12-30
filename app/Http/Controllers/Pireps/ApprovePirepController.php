<?php

namespace App\Http\Controllers\Pireps;

use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ApprovePirepController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $pirep = Pirep::find($request->pirep_id);
        $pirep->state = PirepState::ACCEPTED;
        $pirep->save();

        return redirect()->back()->with(['success' => 'Pirep approved']);
    }
}
