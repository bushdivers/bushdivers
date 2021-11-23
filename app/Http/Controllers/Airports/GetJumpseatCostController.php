<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Services\AirportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetJumpseatCostController extends Controller
{
    protected AirportService $airportService;

    public function __construct(AirportService $airportService)
    {
        $this->airportService = $airportService;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $from, $to): JsonResponse
    {
        $jump = $this->airportService->getCostOfJumpseat($from, $to);
        return response()->json(['cost' => $jump['cost'], 'distance' => $jump['distance']]);
    }
}
