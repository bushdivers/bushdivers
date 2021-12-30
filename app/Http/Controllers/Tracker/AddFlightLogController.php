<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\FlightLog;
use App\Models\Pirep;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddFlightLogController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $pirep = Pirep::findOrFail($request->pirep_id);
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
        } catch (\Exception $exception) {
            return response()->json(['error' => 'missing values'], 422);
        }
    }
}
