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
        // create new row with new figures and update existing row
        $newCargo = new ContractCargo();
        $newCargo->contract_id = $cargo->contract_id;
        $newCargo->contract_type_id = $cargo->contract_type_id;
        $newCargo->current_airport_id = $cargo->current_airport_id;
        $newCargo->cargo = $cargo->cargo;
        $newCargo->cargo_qty = $request->qty;
        $newCargo->save();

        $cargo->cargo_qty = $updatedQty;
        $cargo->save();

        return response()->json(['message' => 'Split cargo'], 201);
    }
}
