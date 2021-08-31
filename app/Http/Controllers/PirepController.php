<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDispatchRequest;
use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\Enums\AircraftState;
use App\Models\Enums\FlightType;
use App\Models\Pirep;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class PirepController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function getDispatch($id)
    {
        $pirep = Pirep::with('flight','flight.depAirport', 'flight.arrAirport', 'aircraft', 'aircraft.fleet')->where('id', $id)->first();
        $depMetar = $this->weatherService->getMetar($pirep->flight->dep_airport_id);
        $arrMetar = $this->weatherService->getMetar($pirep->flight->arr_airport_id);
        return Inertia::render('Flights/Dispatch', ['pirep' => $pirep, 'depMatar' => $depMetar, 'arrMetar' => $arrMetar]);
    }

    public function createDispatch(CreateDispatchRequest $request)
    {
        $aircraft = $this->findAircraft($request->aircraft);
        $pirep = new Pirep();
        $pirep->id = Uuid::uuid4();
        $pirep->user_id = Auth::user()->id;
        $pirep->flight_id = $request->flight;
        $pirep->booking_id = $request->booking;
        $pirep->aircraft_id = $aircraft->id;
        $pirep->flight_type = FlightType::SCHEDULED;
        $pirep->cargo = $request->cargo === 'cargo' ? 5 : 0;
        $pirep->cargo_name = $request->cargo === 'cargo' ? 'Sugar' : '';
        $pirep->pax = $request->cargo === 'pax' ? 2 : 0;
        $pirep->pax_name = $request->cargo === 'pax' ? 'Doctors' : '';
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

    protected function generateCargo($cargoType)
    {

    }

    protected function findAircraft($name)
    {
        $array = explode(' ', $name);
        $reg = $array[count($array)-1];
        $aircraft = Aircraft::where('registration', $reg)->first();

        return $aircraft;
    }
}
