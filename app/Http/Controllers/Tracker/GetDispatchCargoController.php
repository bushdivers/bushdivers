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
            ->first();

        $dispatch->state = PirepState::IN_PROGRESS;
        $dispatch->save();

        $cargo = DB::table('pirep_cargos')
            ->join('contract_cargos', 'pirep_cargos.contract_cargo_id', '=', 'contract_cargos.id')
            ->where('pirep_cargos.pirep_id', $dispatch->id)
            ->select('contract_cargos.id', 'contract_type_id', 'cargo_qty', 'cargo', 'current_airport_id', DB::raw("(CASE WHEN contract_type_id = '1' THEN 'Cargo' ELSE 'Passengers' END) as contract_type"))
            ->get();

        return response()->json($cargo);
    }
}
