<?php

namespace App\Http\Controllers\Scheduler\Finance;

use App\Http\Controllers\Controller;
use App\Services\Finance\CalcMonthlyFees;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProcessAirlineFeesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, CalcMonthlyFees $calcMonthlyFees): JsonResponse
    {
        try {
            $calcMonthlyFees->execute();
            return response()->json(['message' => 'Successfully processed monthly airline fees']);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
