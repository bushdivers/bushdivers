<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Services\Airports\CalcCostOfJumpseat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetJumpseatCostController extends Controller
{
    protected CalcCostOfJumpseat $calcCostOfJumpseat;

    public function __construct(CalcCostOfJumpseat $calcCostOfJumpseat)
    {
        $this->calcCostOfJumpseat = $calcCostOfJumpseat;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $from, $to): JsonResponse
    {
        $jump = $this->calcCostOfJumpseat->execute($from, $to);
        $cost = $jump['cost'];
        $distance = $jump['distance'];
        if ($from == 'AYMR' && $to == 'PAMX') {
            $cost = 0.00;
        }

        if ($from == 'PAMX' && $to == 'AYMR') {
            $cost = 0.00;
        }

        return response()->json(['cost' => $cost, 'distance' => $distance]);
    }
}
