<?php

namespace App\Http\Controllers\Rentals;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Services\Rentals\StartRental;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RentAircraftController extends Controller
{
    protected StartRental $startRental;
    public function __construct(StartRental $startRental)
    {
        $this->startRental = $startRental;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        // TODO: update params
        if ($this->startRental->execute($request->aircraft, Auth::user()->id, Auth::user()->current_airport_id)) {
            return redirect()->to('/rentals')->with(['success' => 'Aircraft rented']);
        } else {
            return redirect()->back()->with(['error' => 'Insufficient funds']);
        }
    }
}
