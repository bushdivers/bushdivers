<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Fleet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetAircraftPriceController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke($id): JsonResponse
    {
        $ac = Aircraft::find($id);
        $fleet = Fleet::find($ac->fleet_id);

        if ($ac->flight_time_mins > $fleet->tbo_mins) {
            $price = $fleet->used_low_price;
        } else {
            $price = $fleet->used_high_price;
        }

        return response()->json(['price' => $price]);
    }
}
