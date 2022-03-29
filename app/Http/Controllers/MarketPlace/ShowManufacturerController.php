<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowManufacturerController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $manufacturer): Response
    {
        $fleet = Fleet::where('manufacturer', $manufacturer)->get();
        return Inertia::render('Marketplace/Aircraft', ['fleet' => $fleet, 'manufacturer' => $manufacturer]);
    }
}
