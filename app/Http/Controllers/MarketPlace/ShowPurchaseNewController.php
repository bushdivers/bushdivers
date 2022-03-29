<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
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
    public function __invoke(Request $request, $fleetId): Response
    {
        $fleet = Fleet::find($fleetId);
        return Inertia::render('Marketplace/PurchaseNew', ['fleet' => $fleet]);
    }
}
