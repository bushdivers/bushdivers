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
        return response()->json(['cost' => $jump['cost'], 'distance' => $jump['distance']]);
    }
}
