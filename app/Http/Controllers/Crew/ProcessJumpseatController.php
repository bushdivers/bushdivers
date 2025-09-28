<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Enums\TransactionTypes;
use App\Services\Finance\AddUserTransaction;
use App\Services\User\UpdateUserLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProcessJumpseatController extends Controller
{
    protected UpdateUserLocation $updateUserLocation;
    protected AddUserTransaction $addUserTransaction;

    public function __construct(
        UpdateUserLocation $updateUserLocation,
        AddUserTransaction $addUserTransaction
    )
    {
        $this->updateUserLocation = $updateUserLocation;
        $this->addUserTransaction = $addUserTransaction;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $transactionValue = $request->cost;

        $isCost = true;

        $hubs = Airport::where('is_hub', true)->get();
        $hubs = $hubs->pluck('icao');
        if ($hubs->contains(Auth::user()->location->identifier) && $hubs->contains($request->icao)) {
            $isCost = false;
        }

        $this->updateUserLocation->execute($request->icao, Auth::user()->id);
        if ($isCost) {
            $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::Jumpseat, -$transactionValue);
        }

        return redirect()->back()->with(['success' => 'Relocated successfully to '.$request->icao.' at a cost of $'.$request->cost]);
    }
}
