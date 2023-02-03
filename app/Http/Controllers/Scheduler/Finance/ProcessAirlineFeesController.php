<?php

namespace App\Http\Controllers\Scheduler\Finance;

use App\Http\Controllers\Controller;
use App\Services\Finance\CalcMonthlyFees;
use App\Services\General\LogSchedule;
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
    public function __invoke(Request $request, CalcMonthlyFees $calcMonthlyFees, LogSchedule $logSchedule): JsonResponse
    {
        try {
            $calcMonthlyFees->execute();
            $logSchedule->execute('monthly-fees', true);
            return response()->json(['message' => 'Successfully processed monthly airline fees']);
        } catch (\Exception $exception) {
            $logSchedule->execute('monthly-fees', false);
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
