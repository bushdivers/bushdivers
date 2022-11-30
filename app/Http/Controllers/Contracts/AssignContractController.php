<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignContractController extends Controller
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
        $contract->user_id = $request->action == 'assign' ? $request->userId : null;
        $contract->save();

        return \response()->json(['message' => 'Contract updated!']);
    }
}
