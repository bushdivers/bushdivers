<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BidForContractController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $contract = Contract::findOrFail($request->id);
        $contract->is_available = false;
        $contract->save();

        Cache::forget($contract->dep_airport_id.'-contracts');

        return \response()->json(['message' => 'Contract saved!']);
    }
}
