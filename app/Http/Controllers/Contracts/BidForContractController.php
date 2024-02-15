<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        if ($request->action == 'remove') {
            $contract->is_available = true;
            $contract->user_id = null;
        } else {
            $contract->is_available = false;
            $contract->user_id = $request->userId;
            Cache::forget($contract->dep_airport_id.'-contracts');
        }

        $contract->save();

        return \response()->json(['message' => 'Contract updated']);
    }
}
