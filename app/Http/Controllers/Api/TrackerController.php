<?php

namespace App\Http\Controllers\Api;

use App\Events\PirepFiled;
use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\FlightLog;
use App\Models\Pirep;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrackerController extends Controller
{
    public function getDispatchedBookings(Request $request): JsonResponse
    {
        $bookings = DB::table('pireps')
            ->join('flights', 'pireps.flight_id', '=', 'flights.id')
            ->join('aircraft', 'pireps.aircraft_id', '=', 'aircraft.id')
            ->join('fleets', 'aircraft.fleet_id', '=', 'fleets.id')
            ->select('pireps.*', 'flights.flight_number', 'flights.dep_airport_id', 'flights.arr_airport_id', 'fleets.name', 'aircraft.registration')
            ->where('pireps.user_id', Auth::user()->id)
            ->where('flights.dep_airport_id', Auth::user()->current_airport_id)
            ->get();

        return response()->json($bookings);
    }

    public function postFlightLog(Request $request): JsonResponse
    {
        $logs = FlightLog::where('pirep_id', $request->pirep_id)->get();
        if ($logs->count() < 1) {
            $pirep = Pirep::find($request->pirep_id);
            $pirep->state = PirepState::IN_PROGRESS;
            $pirep->status = PirepStatus::BOARDING;
            $pirep->save();
        }

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
            $flightLog->vs = $request->vs;
            $flightLog->sim_time = $request->sim_time;
            $flightLog->zulu_time = $request->zulu_time;
            $flightLog->save();

            return response()->json([],201);
        } catch (\PDOException $exception) {
            return response()->json(['error' => 'missing values'], 422);
        }
    }

    public function submitPirep(Request $request): JsonResponse
    {
        // set pirep status to completed
        $pirep = Pirep::find($request->pirep_id);
        $pirep->fuel_used = $request->fuel_used;
        $pirep->distance = $request->distance;
        $pirep->flight_time = $request->flight_time;
        $pirep->landing_rate = $request->landing_rate;
        $pirep->state = PirepState::ACCEPTED;
        $pirep->status = PirepStatus::ARRIVED;
        $pirep->submitted_at = Carbon::now();
        $pirep->block_off_time = $request->block_off_time;
        $pirep->block_on_time = $request->block_on_time;
        $pirep->save();

        // dispatch completed event (removes booking, resets aircraft, checks rank and awards
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
}
