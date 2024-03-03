<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;

class ShareContractController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $contract = Contract::find($request->id);
        if ($contract->active_pirep) {
            return \response()->json(['message' => 'Contract is in progress'], 422);
        }
        $contract->user_id = null;
        $contract->is_shared = true;
        $contract->save();

        return \response()->json(['message' => 'Contract shared']);
    }
}
