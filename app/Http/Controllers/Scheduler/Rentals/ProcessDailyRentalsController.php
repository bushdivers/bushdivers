<?php

namespace App\Http\Controllers\Scheduler\Rentals;

use App\Http\Controllers\Controller;
use App\Services\Rentals\CheckRentalDailyFee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProcessDailyRentalsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, CheckRentalDailyFee $checkRentalDailyFee): JsonResponse
    {
        try {
            $checkRentalDailyFee->execute();
            return response()->json(['message' => 'Successfully checked rental fees']);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
