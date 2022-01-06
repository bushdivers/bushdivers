<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Services\Dispatch\CalcCargoWeight;
use App\Services\Dispatch\CalcPassengerCount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GetActiveDispatchController extends Controller
{
    protected CalcCargoWeight $calcCargoWeight;
    protected CalcPassengerCount $calcPassengerCount;

    public function __construct(
        CalcCargoWeight $calcCargoWeight,
        CalcPassengerCount $calcPassengerCount
    )
    {
        $this->calcPassengerCount = $calcPassengerCount;
        $this->calcCargoWeight = $calcCargoWeight;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {

        $dispatch = Pirep::with('aircraft', 'aircraft.fleet', 'depAirport', 'arrAirport')
            ->where('user_id', Auth::user()->id)
            ->where('state', PirepState::DISPATCH)
            ->where('is_rental', false)
            ->first();

        $rentalDispatch = Pirep::with('rental', 'rental.fleet', 'depAirport', 'arrAirport')
            ->where('user_id', Auth::user()->id)
            ->where('state', PirepState::DISPATCH)
            ->where('is_rental', true)
            ->first();


        if (!$dispatch && !$rentalDispatch) {
            return response()->json(['message' => 'No dispatch available'], 204);
        }

        if (!$dispatch) {
            $dispatch = $rentalDispatch;
        }

        $cargoWeight = 0;
        $passengerCount = 0;
        if (!$dispatch->is_empty) {
            $cargo = DB::table('pirep_cargos')
                ->join('contract_cargos', 'pirep_cargos.contract_cargo_id', '=', 'contract_cargos.id')
                ->where('pirep_cargos.pirep_id', $dispatch->id)
                ->select('contract_cargos.id', 'contract_type_id', 'cargo_qty')
                ->get();

            $cargoWeight = $this->calcCargoWeight->execute($cargo, false);
            $passengerCount = $this->calcPassengerCount->execute($cargo);
        }

        $data = [
            'id' => $dispatch->id,
            'departure_airport_id' => $dispatch->departure_airport_id,
            'departure_airport_lat' => $dispatch->depAirport->lat,
            'departure_airport_lon' => $dispatch->depAirport->lon,
            'destination_airport_lat' => $dispatch->arrAirport->lat,
            'destination_airport_lon' => $dispatch->arrAirport->lon,
            'destination_airport_id' => $dispatch->destination_airport_id,
            'name' => $dispatch->is_rental ? $dispatch->rental->fleet->manufacturer . ' ' . $dispatch->rental->fleet->name : $dispatch->aircraft->fleet->manufacturer . ' ' . $dispatch->aircraft->fleet->name,
            'aircraft_type' => $dispatch->is_rental ? $dispatch->rental->fleet->type : $dispatch->aircraft->fleet->type,
            'registration' => $dispatch->is_rental ? $dispatch->rental->registration : $dispatch->aircraft->registration,
            'planned_fuel' => $dispatch->planned_fuel,
            'cargo_weight' => $cargoWeight,
            'passenger_count' => $passengerCount,
            'is_empty' => $dispatch->is_empty
        ];

        return response()->json($data);
    }
}
