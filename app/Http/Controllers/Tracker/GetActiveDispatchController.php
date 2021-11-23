<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Services\DispatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GetActiveDispatchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $dispatchService = new DispatchService();

        $dispatch = Pirep::with('aircraft', 'aircraft.fleet', 'depAirport', 'arrAirport')
            ->where('user_id', Auth::user()->id)
            ->where('state', PirepState::DISPATCH)
            ->first();

        if (!$dispatch) {
            return response()->json(['message' => 'No dispatch available'], 204);
        }

        $cargoWeight = 0;
        $passengerCount = 0;
        if (!$dispatch->is_empty) {
            $cargo = DB::table('pirep_cargos')
                ->join('contract_cargos', 'pirep_cargos.contract_cargo_id', '=', 'contract_cargos.id')
                ->where('pirep_cargos.pirep_id', $dispatch->id)
                ->select('contract_cargos.id', 'contract_type_id', 'cargo_qty')
                ->get();

            $cargoWeight = $dispatchService->calculateCargoWeight($cargo, false);
            $passengerCount = $dispatchService->calculatePassengerCount($cargo);
        }

        $data = [
            'id' => $dispatch->id,
            'departure_airport_id' => $dispatch->departure_airport_id,
            'departure_airport_lat' => $dispatch->depAirport->lat,
            'departure_airport_lon' => $dispatch->depAirport->lon,
            'destination_airport_lat' => $dispatch->arrAirport->lat,
            'destination_airport_lon' => $dispatch->arrAirport->lon,
            'destination_airport_id' => $dispatch->destination_airport_id,
            'name' => $dispatch->aircraft->fleet->manufacturer . ' ' . $dispatch->aircraft->fleet->name,
            'aircraft_type' => $dispatch->aircraft->fleet->type,
            'registration' => $dispatch->aircraft->registration,
            'planned_fuel' => $dispatch->planned_fuel,
            'cargo_weight' => $cargoWeight,
            'passenger_count' => $passengerCount,
            'is_empty' => $dispatch->is_empty
        ];

        return response()->json($data);
    }
}
