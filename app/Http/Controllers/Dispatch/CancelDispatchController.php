<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Services\Pireps\RemoveSinglePirep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CancelDispatchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, RemoveSinglePirep $removeSinglePirep): RedirectResponse
    {
        $pirep = Pirep::where('user_id', Auth::id())->find($request->pirep);

        if (!$pirep) {
            return redirect()->back()->with(['error' => 'Flight already cancelled or no longer exists']);
        }

        if ($pirep->state == PirepState::ACCEPTED || $pirep->state == PirepState::REJECTED) {
            return redirect()->back()->with(['error' => 'Flight already completed']);
        }

        if ($removeSinglePirep->execute($pirep))
            return redirect()->back()->with(['success' => 'Dispatch cancelled successfully']);

        return redirect()->back()->with(['error' => 'Error cancelling dispatch']);
    }
}
