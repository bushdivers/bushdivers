<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Services\Contracts\StoreContracts;
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
    public function __invoke(Request $request, StoreContracts $storeContracts): JsonResponse
    {
        $contract = Contract::findOrFail($request->id);

        if ($request->action == 'assign') {
            if ($request->qty < $contract->cargo_qty) {
                $newContractQty = $contract->cargo_qty - $request->qty;
                $newValue = $contract->contract_value / ($contract->cargo_qty / $newContractQty);
                $updatedValue = $contract->contract_value / ($contract->cargo_qty / $request->qty);
                // create new contract
                $storeContracts->execute([[
                    'departure' => $contract->dep_airport_id,
                    'destination' => $contract->arr_airport_id,
                    'distance' => $contract->distance,
                    'heading' => $contract->heading,
                    'contract_value' => $newValue,
                    'cargo_type' => $contract->cargo_type,
                    'cargo' => $contract->cargo,
                    'cargo_qty' => $newContractQty,
                    'expires_at' => $contract->expires_at,
                ]], false);
                $contract->contract_value = $updatedValue;
                $contract->cargo_qty = $request->qty;
            }

            $contract->user_id = $request->userId;
        } else {
            $contract->user_id = null;
        }

        $contract->save();

        return \response()->json(['message' => 'Contract updated!']);
    }
}
