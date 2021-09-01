<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDispatchRequest;
use App\Models\Aircraft;
use App\Models\Booking;
use App\Models\Enums\AircraftState;
use App\Models\Enums\FlightType;
use App\Models\Fleet;
use App\Models\Pirep;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        return Inertia::render('Flights/Dispatch', ['pirep' => $pirep, 'depMetar' => $depMetar, 'arrMetar' => $arrMetar]);
    }

    public function createDispatch(CreateDispatchRequest $request)
    {
        $pax = 0;
        $cargo = 0;
        $cargoType = '';
        $paxType = '';

        $aircraft = $this->findAircraft($request->aircraft);
        $fleet = Fleet::find($aircraft->fleet_id);
        if ($request->cargo == 'cargo') {
            $generatedCargo = $this->generateCargo($fleet->cargo_capacity);
            $cargo = $generatedCargo['cargo_qty'];
            $cargoType = $generatedCargo['cargo_type'];
        } else {
            $generatedPax = $this->generatePax($fleet->pax_capacity);
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

    protected function generateCargo(int $maxQty): array
    {
        $types = DB::table('cargo_types')->where('type', 1)->get();
        // select random type
        $type = $types->random();
        // generate number based on aircraft capacity
        $num = $this->generateRandomCargoAmount($maxQty);

        return ['cargo_type' => $type->text, 'cargo_qty' => $num];
    }

    protected function generatePax(int $maxQty): array
    {
        $types = DB::table('cargo_types')->where('type', 2)->get();
        // select random type
        $type = $types->random();
        $paxNum = $this->generateRandomCargoAmount($maxQty);
        $baggage = ($paxNum * 0.9) * 20;

        return ['pax_type' => $type->text, 'pax_qty' => $paxNum, 'baggage' => $baggage];
    }

    protected function generateRandomCargoAmount(int $maxQty): int
    {
        $min = round($maxQty * ((100-60) / 100));
        return mt_rand($min, $maxQty);
    }

    protected function findAircraft($name)
    {
        $array = explode(' ', $name);
        $reg = $array[count($array)-1];
        $aircraft = Aircraft::where('registration', $reg)->first();

        return $aircraft;
    }
}
