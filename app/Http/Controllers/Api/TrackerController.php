<?php

namespace App\Http\Controllers\Api;

use App\Events\PirepFiled;
use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\Enums\TransactionTypes;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Services\AirportService;
use App\Services\CargoService;
use App\Services\ContractService;
use App\Services\DispatchService;
use App\Services\FinancialsService;
use App\Services\PirepService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrackerController extends Controller
{
    protected AirportService $airportService;
    protected FinancialsService $financialsService;
    protected UserService $userService;

    public function __construct(AirportService $airportService, FinancialsService $financialsService, UserService $userService)
    {
        $this->airportService = $airportService;
        $this->financialsService = $financialsService;
        $this->userService = $userService;
    }

    public function getDispatch(Request $request): JsonResponse
    {
        $dispatchService = new DispatchService();

        $dispatch = Pirep::with('aircraft', 'aircraft.fleet', 'depAirport', 'arrAirport')
            ->where('user_id', Auth::user()->id)
            ->where('state', PirepState::DISPATCH)
            ->first();

        if (!$dispatch) {
            return response()->json(['message' => 'No dispatch available'], 204);
        }

        $cargo = DB::table('pirep_cargos')
            ->join('contract_cargos', 'pirep_cargos.contract_cargo_id', '=', 'contract_cargos.id')
            ->where('pirep_cargos.pirep_id', $dispatch->id)
            ->select('contract_cargos.id', 'contract_type_id', 'cargo_qty')
            ->get();

        $cargoWeight = $dispatchService->calculateCargoWeight($cargo, false);
        $passengerCount = $dispatchService->calculatePassengerCount($cargo);

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
            'passenger_count' => $passengerCount
        ];

        return response()->json($data);
    }

    public function getDispatchCargo(Request $request): JsonResponse
    {
        $dispatch = Pirep::where('user_id', Auth::user()->id)
            ->where('state', PirepState::DISPATCH)
            ->first();

        $cargo = DB::table('pirep_cargos')
            ->join('contract_cargos', 'pirep_cargos.contract_cargo_id', '=', 'contract_cargos.id')
            ->where('pirep_cargos.pirep_id', $dispatch->id)
            ->select('contract_cargos.id', 'contract_type_id', 'cargo_qty', 'cargo', 'current_airport_id', DB::raw("(CASE WHEN contract_type_id = '1' THEN 'Cargo' ELSE 'Passengers' END) as contract_type"))
            ->get();

        return response()->json($cargo);
    }

    public function postFlightLog(Request $request): JsonResponse
    {
        $pirep = Pirep::find($request->pirep_id);
        $logs = FlightLog::where('pirep_id', $request->pirep_id)->get();
        if ($logs->count() < 1) {
            $pirep->state = PirepState::IN_PROGRESS;
            $pirep->status = PirepStatus::BOARDING;
        }

        $pirep->current_lat = $request->lat;
        $pirep->current_lon = $request->lon;
        $pirep->current_heading = $request->heading;
        $pirep->current_altitude = $request->altitude;
        $pirep->current_indicated_speed = $request->indicated_speed;
        $pirep->save();

        try {
            $flightLog = new FlightLog();
            $flightLog->pirep_id = $request->pirep_id;
            $flightLog->lat = $request->lat;
            $flightLog->lon = $request->lon;
            $flightLog->distance = $request->distance;
            $flightLog->heading = $request->heading;
            $flightLog->altitude = $request->altitude;
            $flightLog->indicated_speed = $request->indicated_speed;
            $flightLog->ground_speed = $request->ground_speed;
            $flightLog->fuel_flow = $request->fuel_flow;
            $flightLog->vs = $request->vs * 60;
            $flightLog->sim_time = Carbon::parse($request->sim_time);
            $flightLog->zulu_time = Carbon::parse($request->zulu_time);
            $flightLog->save();

            return response()->json([],201);
        } catch (\PDOException $exception) {
            return response()->json(['error' => 'missing values'], 422);
        }
    }

    public function submitPirep(Request $request): JsonResponse
    {
        $pirep = Pirep::find($request->pirep_id);

         $pirepService = new PirepService();
        // calculate coordinate points in flight logs
         $distance = $pirepService->calculateTotalFlightDistance($pirep);
         $startTime = Carbon::createFromFormat('d/m/Y H:i:s',  $request->block_off_time);
         $endTime = Carbon::createFromFormat('d/m/Y H:i:s',  $request->block_on_time);
         $duration = $startTime->diffInMinutes($endTime);

//         $debug = [
//             'start' => $startTime,
//             'end' => $endTime,
//             'duration' => $duration,
//             'request' => $request->all()
//         ];
//        Log::debug($request->block_off_time);
        // set pirep status to completed
        $pirep->fuel_used = $request->fuel_used;
        $pirep->distance = $distance;
        $pirep->flight_time = $duration;
        $pirep->landing_rate = $request->landing_rate;
        $pirep->state = PirepState::ACCEPTED;
        $pirep->status = PirepStatus::ARRIVED;
        $pirep->submitted_at = Carbon::now();
        $pirep->block_off_time = $startTime;
        $pirep->block_on_time = $endTime;
        $pirep->save();

        // update cargo and contract
        $contractService = new ContractService();
        $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
        foreach ($pc as $c) {
            $contractCargo = ContractCargo::find($c->contract_cargo_id);
            $contractService->updateCargo($contractCargo->id, $pirep->destination_airport_id);
        }

        // process financials
        $this->financialsService->processPirepFinancials($pirep);

        // dispatch completed event (updates cargo/contract, resets aircraft, checks rank and awards)
        PirepFiled::dispatch($pirep);

        return response()->json(['message' => 'Pirep successfully filed']);
    }

    public function updatePirepStatus(Request $request): JsonResponse
    {
        $pirep = Pirep::find($request->pirep_id);
        $pirep->status = $request->status;
        $pirep->state = PirepState::IN_PROGRESS;
        $pirep->save();

        return response()->json(['message' => 'Updated status']);
    }

    public function cancelPirep(Request $request): JsonResponse
    {
        $pirep = Pirep::find($request->pirep_id);
        $pirep->state = PirepState::DISPATCH;
        $pirep->save();

        FlightLog::where('pirep_id', $request->pirep_id)->delete();

        return response()->json(['message' => 'Pirep Cancelled']);
    }

    public function checkDistance(Request $request)
    {
        $distance = $this->airportService->calculateDistanceBetweenPoints(
            $request->StartLat,
            $request->StartLon,
            $request->EndLat,
            $request->EndLon,
            true
        );

        return response()->json($distance);
    }

    public function updateDestination(Request $request)
    {
        // find nearest airport
        $airport = $this->airportService->findAirportsByLatLon($request->lat, $request->lon, 2);
        // update piirep destination to new icao
        $pirep = Pirep::find($request->pirep_id);
        $pirep->destination_airport_id = $airport->identifier;
        $pirep->save();

        // return icao
        return response()->json(['icao' => $airport->identifier]);
    }
}
