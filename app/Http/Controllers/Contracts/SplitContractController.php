<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Services\Contracts\StoreContracts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SplitContractController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): JsonResponse
    {

        $existingContract = Contract::find($request->id);

        if ($existingContract->active_pirep) {
            return \response()->json(['message' => 'Contract is in progress'], 422);
        }

        $newQty = $request->qty;
        $remainingQty = $existingContract->cargo_qty - $newQty;
        $splitPercentage = ($newQty / $existingContract->cargo_qty) * 100;
        $newValue = round(($splitPercentage / 100) * $existingContract->contract_value, 2);
        $remainingValue = round($existingContract->contract_value - $newValue, 2);

        $existingContract->cargo_qty = $newQty;
        $existingContract->contract_value = $newValue;

        $contract = new Contract();
        $contract->contract_type_id = 1;
        $contract->dep_airport_id = $existingContract->dep_airport_id;
        $contract->current_airport_id = $existingContract->dep_airport_id;
        $contract->arr_airport_id = $existingContract->arr_airport_id;
        $contract->distance = $existingContract->distance;
        $contract->contract_value = $remainingValue;
        $contract->cargo_type = $existingContract->cargo_type;
        $contract->cargo = $existingContract->cargo;
        $contract->cargo_qty = $remainingQty;
        $contract->heading = $existingContract->heading;
        $contract->expires_at = $existingContract->expires_at;
        $contract->is_available = false;
        $contract->is_shared = $existingContract->is_shared;
        if ($existingContract->cargo_type == 1) {
            $existingContract->payload = $newQty;
            $contract->payload = $remainingQty;
        } else {
            $existingContract->pax = $newQty;
            $contract->pax = $remainingQty;
        }
        $contract->user_id = $existingContract->user_id;
        $contract->is_custom = false;
        $contract->fuel_qty = $existingContract->fuel_qty;
        $contract->fuel_type = $existingContract->fuel_type;
        $contract->airport = $existingContract->airport;
        $contract->community_job_contract_id = $existingContract->community_job_contract_id;
        $existingContract->saveOrFail();
        $contract->saveOrFail();

        return \response()->json(['message' => 'Contract split']);
    }
}
