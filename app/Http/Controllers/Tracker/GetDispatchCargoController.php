<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GetDispatchCargoController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $dispatch = Pirep::where('user_id', Auth::user()->id)
            ->where('state', PirepState::DISPATCH)
            ->firstOrFail();

        $cargo = DB::table('pirep_cargos')
            ->join('contracts', 'pirep_cargos.contract_cargo_id', '=', 'contracts.id')
            ->join('airports AS arr_airport', 'contracts.arr_airport_id', '=', 'arr_airport.id')
            ->join('airports AS current_airport', 'contracts.current_airport_id', '=', 'current_airport.id')
            ->where('pirep_cargos.pirep_id', $dispatch->id)
            ->select('contracts.id', 'cargo_type as contract_type_id', 'cargo_qty', 'cargo', DB::raw('current_airport.identifier AS current_airport_id'), DB::raw('arr_airport.identifier AS arr_airport_id'), DB::raw("(CASE WHEN cargo_type = '1' THEN 'Cargo' ELSE 'Passengers' END) as contract_type"))
            ->get();

        return response()->json($cargo);
    }
}
