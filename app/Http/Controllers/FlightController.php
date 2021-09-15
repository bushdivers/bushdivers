<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use App\Models\Booking;
use App\Models\Enums\AircraftState;
use App\Models\Enums\FlightType;
use App\Models\Fleet;
use App\Models\Flight;
use App\Models\Pirep;
use App\Models\User;
use App\Services\AircraftService;
use App\Services\AirportService;
use App\Services\CargoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Ramsey\Uuid\Uuid;

class FlightController extends Controller
{
    protected AircraftService $aircraftService;
    protected CargoService $cargoService;

    public function __construct(AircraftService $aircraftService, CargoService $cargoService)
    {
        $this->aircraftService = $aircraftService;
        $this->cargoService = $cargoService;
    }

    public function index()
    {
        $flights = Flight::with(['depAirport', 'arrAirport'])
            ->where('dep_airport_id', Auth::user()->current_airport_id)
            ->where('is_active', true)
            ->get();

        $bookings = Booking::where('user_id', Auth::user()->id)->get();

        return Inertia::render('Flights/FlightSearch', ['flights' => $flights, 'bookings' => $bookings]);
    }

    public function search(Request $request)
    {
        $dep = $request->query('dep');
        $arr = $request->query('arr');

        $where = [];
        if ($dep) $where[] = ['dep_airport_id', $dep];
        if ($arr) $where[] = ['arr_airport_id', $arr];
        $flights = Flight::with(['depAirport', 'arrAirport'])
            ->where('is_active', true)
            ->where($where)
            ->get();

        $bookings = Booking::where('user_id', Auth::user()->id)->get();

        return Inertia::render('Flights/FlightSearch', [
            'flights' => $flights,
            'bookings' => $bookings
        ]);
    }

    public function routes()
    {
        $airports = DB::table('airports')
            ->join('flights', 'airports.identifier', '=', 'flights.arr_airport_id')
            ->select('airports.identifier', 'airports.name', 'airports.lon', 'airports.lat', 'airports.is_hub')
            ->where('airports.is_hub', false)
            ->where('flights.is_custom_flight', false)
            ->distinct()
            ->get();

        $hubs = Airport::where('is_hub', true)->get();

        $flights = Flight::with('depAirport', 'arrAirport')
            ->where('is_active', true)
            ->where('is_custom_flight', false)
            ->get();

        return Inertia::render('Flights/RouteMap', ['flights' => $flights, 'airports' => $airports, 'hubs' => $hubs]);
    }

    public function charter(): Response
    {
        $user = User::with('location')->find(Auth::user()->id);
        return Inertia::render('Flights/CharterFlight', ['user' => $user]);
    }

    public function createCharter(Request $request): RedirectResponse
    {
        $flightId = null;
        // check if a flight exists
        $flight = Flight::where('dep_airport_id', $request->dep)->where('arr_airport_id', $request->arr)->first();
        if ($flight) {
            // if so use this
            $flightId = $flight->id;
        } else {
            // create charter flight if required
            $flightsCount = Flight::where('is_custom_flight', true)->count();
            $customFlight = new Flight();
            $customFlight->id = Uuid::uuid4();
            $customFlight->flight_number = 5000 + $flightsCount;
            $customFlight->dep_airport_id = $request->dep;
            $customFlight->arr_airport_id = $request->arr;
            $customFlight->alt_airport_id = '';
            $customFlight->distance = $request->distance;
            $customFlight->flight_type = FlightType::CHARTER;
            $customFlight->is_custom_flight = true;
            $customFlight->save();

            $flightId = $customFlight->id;
        }

        // create a booking for flight
        $booking = new Booking();
        $booking->user_id = Auth::user()->id;
        $booking->flight_id = $flightId;
        $booking->save();

        // generate cargo
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

        // create prefile pirep
        $pirep = new Pirep();
        $pirep->id = Uuid::uuid4();
        $pirep->user_id = Auth::user()->id;
        $pirep->flight_id = $flightId;
        $pirep->booking_id = $booking->id;
        $pirep->aircraft_id = $aircraft->id;
        $pirep->flight_type = FlightType::CHARTER;
        $pirep->cargo = $cargo;
        $pirep->cargo_name = $cargoType;
        $pirep->pax = $pax;
        $pirep->pax_name = $paxType;
        $pirep->planned_cruise_altitude = $request->cruise;
        $pirep->submitted_at = null;
        $pirep->block_off_time = null;
        $pirep->block_on_time = null;
        $pirep->save();

        $booking->has_dispatch = $pirep->id;
        $booking->save();

        $aircraft->state = AircraftState::BOOKED;
        $aircraft->save();

        return redirect()->back()->with(['success' => 'Custom flight dispatch created']);
    }
}
