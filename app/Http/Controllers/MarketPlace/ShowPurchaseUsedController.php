<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowPurchaseUsedController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke($id, $buyer): Response
    {
        $aircraft = Aircraft::with('fleet')->find($id);
        $hubs = Airport::where('is_hub', true)->orderBy('identifier')->get();
        return Inertia::render('Marketplace/Purchase', ['aircraft' => $aircraft, 'purchaseType' => 'used', 'hubs' => $hubs, 'buyer' => $buyer]);
    }
}
