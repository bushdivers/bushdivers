<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowMarketPlaceController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
//        $fleet = Fleet::all();
        $manufacturers = DB::table('fleets')
            ->select('manufacturer')
            ->distinct()
            ->get();
        return Inertia::render('Marketplace/Manufacturers', ['manufacturers' => $manufacturers]);
    }
}
