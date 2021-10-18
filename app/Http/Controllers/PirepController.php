<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDispatchRequest;
use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\ContractCargo;
use App\Models\Enums\AircraftState;
use App\Models\Enums\FlightType;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\Fleet;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Point;
use App\Services\AircraftService;
use App\Services\CargoService;
use App\Services\WeatherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Ramsey\Uuid\Uuid;

class PirepController extends Controller
{
    protected WeatherService $weatherService;
    protected CargoService $cargoService;
    protected AircraftService $aircraftService;

    public function __construct(
        WeatherService $weatherService,
        CargoService $cargoService,
        AircraftService $aircraftService
    ) {
        $this->weatherService = $weatherService;
        $this->cargoService = $cargoService;
        $this->aircraftService = $aircraftService;
    }

    public function getDispatch($id)
    {
        $pirep = Pirep::with('flight', 'flight.depAirport', 'flight.arrAirport', 'aircraft', 'aircraft.fleet')
            ->where('id', $id)
            ->where('user_id', Auth::user()->id)
            ->first();

        $depMetar = $this->weatherService->getMetar($pirep->flight->dep_airport_id);
        $arrMetar = $this->weatherService->getMetar($pirep->flight->arr_airport_id);
        return Inertia::render('Flights/Dispatch',
            ['pirep' => $pirep, 'depMetar' => $depMetar, 'arrMetar' => $arrMetar]);
    }

    public function createDispatch(CreateDispatchRequest $request): RedirectResponse
    {
        $pax = 0;
        $cargo = 0;
        $cargoType = '';
        $paxType = '';

        $aircraft = $this->aircraftService->findAircraftFromString($request->aircraft);
        if (is_null($aircraft)) {
            return redirect()->back()->with(['error' => 'There is a problem selecting the aircraft']);
        }
        $fleet = Fleet::find($aircraft->fleet_id);
        if ($request->cargo == 'cargo') {
            $generatedCargo = $this->cargoService->generateCargo($fleet->cargo_capacity);
            $cargo = $generatedCargo['cargo_qty'];
            $cargoType = $generatedCargo['cargo_type'];
        } else {
            $generatedPax = $this->cargoService->generatePax($fleet->pax_capacity);
            $pax = $generatedPax['pax_qty'];
            $paxType = $generatedPax['pax_type'];
            $cargoType = 'Baggage';
            $cargo = $generatedPax['baggage'];
        }

        $pirep = new Pirep();
        $pirep->id = Uuid::uuid4();
        $pirep->user_id = Auth::user()->id;
        $pirep->flight_id = $request->flight;
        $pirep->booking_id = $request->booking;
        $pirep->aircraft_id = $aircraft->id;
        $pirep->flight_type = FlightType::SCHEDULED;
        $pirep->cargo = $cargo;
        $pirep->cargo_name = $cargoType;
        $pirep->pax = $pax;
        $pirep->pax_name = $paxType;
        $pirep->planned_cruise_altitude = $request->cruise;
        $pirep->submitted_at = null;
        $pirep->block_off_time = null;
        $pirep->block_on_time = null;
        $pirep->save();

        $booking = Booking::find($request->booking);
        $booking->has_dispatch = $pirep->id;
        $booking->save();

        $aircraft->state = AircraftState::BOOKED;
        $aircraft->save();

        return redirect()->back()->with(['success' => 'Dispatch created']);
    }

    public function logbook(): Response
    {
        $logbook = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet')
            ->where('user_id', Auth::user()->id)
            ->where('state', PirepState::ACCEPTED)
            ->orderBy('submitted_at', 'desc')
            ->paginate(10);


        return Inertia::render('Crew/Logbook', ['logbook' => $logbook]);
    }

    public function logbookDetail($pirep): Response
    {
        $p = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet')
            ->where('id', $pirep)
            ->where('user_id', Auth::user()->id)
            ->first();

        $pc = PirepCargo::where('pirep_id', $pirep)->pluck('contract_cargo_id');

        $cargo = ContractCargo::with('contract')
            ->whereIn('id', $pc)
            ->get();
        $points = Point::where('pirep_id', $pirep)->where('points', '>', 0)->get();

        $logs = FlightLog::where('pirep_id', $pirep)->orderBy('created_at')->get();
        //$coords = DB::table('flight_logs')->where('pirep_id', $pirep)->select('lat', 'lon')->orderBy('created_at')->get();
        return Inertia::render('Crew/LogbookDetail', [
            'pirep' => $p,
            'points' => $points,
            'logs' => $logs,
            'coords' => $logs->pluck('lat', 'lon'),
            'cargo' => $cargo
        ]);
    }

    public function flightMap(): Response
    {
        $liveFlights = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
            ->where('state', PirepState::IN_PROGRESS)
            ->get();
        return Inertia::render('Flights/LiveFlights', ['flights' => $liveFlights]);
    }

    public function liveFlights(): JsonResponse
    {
        $liveFlights = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
            ->where('state', PirepState::IN_PROGRESS)
            ->get();

        return \response()->json(['flights' => $liveFlights]);
    }
}
