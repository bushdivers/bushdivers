<?php

namespace App\Http\Controllers\Scheduler\Finance;

use App\Http\Controllers\Controller;
use App\Services\Finance\CollectFinancePayments;
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
    public function __invoke(Request $request, CollectFinancePayments $collectFinancePayments): JsonResponse
    {
        try {
            $collectFinancePayments->execute();
            return response()->json(['message' => 'Successfully collected loan payments']);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
