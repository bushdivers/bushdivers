<?php

namespace App\Http\Controllers\Aircraft;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\FinanceAgreement;
use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowMyAircraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        // get my aircraft
        $aircraft = Aircraft::with('fleet')->where('owner_id', Auth::user()->id)->get();
        // get my rentals
        $rentals = Rental::with('fleet')
            ->where('user_id', Auth::user()->id)
            ->where('is_active', true)
            ->get();
        // get my credit agreements
        $agreements = FinanceAgreement::with('aircraft')
            ->where('user_id', Auth::user()->id)
            ->where('is_cancelled', false)
            ->orderBy('is_active', 'desc')
            ->orderBy('is_paid')
            ->get();

        return Inertia::render('Fleet/MyAircraft', [
            'aircraft' => $aircraft,
            'rentals' => $rentals,
            'agreements' => $agreements
        ]);
    }
}
