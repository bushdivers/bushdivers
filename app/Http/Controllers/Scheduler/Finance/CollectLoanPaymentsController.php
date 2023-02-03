<?php

namespace App\Http\Controllers\Scheduler\Finance;

use App\Http\Controllers\Controller;
use App\Services\Finance\CollectFinancePayments;
use App\Services\General\LogSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollectLoanPaymentsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, CollectFinancePayments $collectFinancePayments, LogSchedule $logSchedule): JsonResponse
    {
        try {
            $collectFinancePayments->execute();
            $logSchedule->execute('loan-collection', true);
            return response()->json(['message' => 'Successfully collected loan payments']);
        } catch (\Exception $exception) {
            $logSchedule->execute('loan-collection', false);
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
