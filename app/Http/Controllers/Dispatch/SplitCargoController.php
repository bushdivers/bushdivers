<?php

namespace App\Http\Controllers\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\ContractCargo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SplitCargoController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        // get current contract cargo
        $cargo = ContractCargo::find($request->id);
        $updatedQty = $cargo->cargo_qty - $request->qty;

        $updatedValue = $cargo->contract_value / ($cargo->cargo_qty / $updatedQty);
        $newItemValue = $cargo->contract_value / ($cargo->cargo_qty / $request->qty);
        // create new row with new figures and update existing row
        $newCargo = new ContractCargo();
        $newCargo->contract_id = $cargo->contract_id;
        $newCargo->cargo_type_id = $cargo->cargo_type_id;
        $newCargo->current_airport_id = $cargo->current_airport_id;
        $newCargo->dep_airport_id = $cargo->dep_airport_id;
        $newCargo->arr_airport_id = $cargo->arr_airport_id;
        $newCargo->is_available = true;
        $newCargo->cargo = $cargo->cargo;
        $newCargo->cargo_qty = $request->qty;
        $newCargo->contract_value = $newItemValue;
        $newCargo->save();

        $cargo->cargo_qty = $updatedQty;
        $cargo->contract_value = $updatedValue;
        $cargo->save();

        return response()->json(['message' => 'Split cargo'], 201);
    }
}
