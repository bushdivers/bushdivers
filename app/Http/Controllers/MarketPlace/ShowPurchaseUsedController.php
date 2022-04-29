<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
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
    public function __invoke($id): Response
    {
        $aircraft = Aircraft::with('fleet')->find($id);
        return Inertia::render('Marketplace/Purchase', ['aircraft' => $aircraft, 'purchaseType' => 'used']);
    }
}
