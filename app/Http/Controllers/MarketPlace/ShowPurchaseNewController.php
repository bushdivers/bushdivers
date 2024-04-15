<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowPurchaseNewController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $fleetId, $buyer): Response
    {
        $fleet = Fleet::find($fleetId);
        $hubs = Airport::where('is_hub', true)->orderBy('identifier')->get();
        return Inertia::render('Marketplace/Purchase', ['aircraft' => $fleet, 'purchaseType' => 'new', 'buyer' => $buyer, 'hubs' => $hubs]);
    }
}
