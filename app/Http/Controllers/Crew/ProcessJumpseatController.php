<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Enums\TransactionTypes;
use App\Services\Airports\CalcCostOfJumpseat;
use App\Services\Finance\AddUserTransaction;
use App\Services\User\UpdateUserLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProcessJumpseatController extends Controller
{
    public function __construct(
        protected UpdateUserLocation $updateUserLocation,
        protected AddUserTransaction $addUserTransaction,
        protected CalcCostOfJumpseat $calcCostOfJumpseat
    ) {}


    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'icao' => 'required|exists:airports,identifier',
        ]);

        if ($validated['icao'] === Auth::user()->location->identifier) {
            return redirect()->back()->with(['error' => 'You are already at this airport']);
        }

        $hubs = Airport::hub()->get();
        $hubs = $hubs->pluck('icao');
        if ($hubs->contains(Auth::user()->location->identifier) && $hubs->contains($request->icao)) {
            $cost = 0.0;
        }
        else
        {
            $jump = $this->calcCostOfJumpseat->execute(Auth::user()->location->identifier, $request->icao);
            $cost = $jump['cost'];
        }

        $this->updateUserLocation->execute($request->icao, Auth::user()->id);
        if ($cost > 0) {
            $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::Jumpseat, -$cost);
        }

        return redirect()->back()->with(['success' => 'Relocated successfully to '.$request->icao.' at a cost of $'.$cost]);
    }
}
