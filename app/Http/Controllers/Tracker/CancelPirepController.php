<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\FlightLog;
use App\Models\Pirep;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CancelPirepController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $pirep = Pirep::where('user_id', Auth::user()->id)
                ->where('state', '<>', PirepState::ACCEPTED)
                ->first();

            $pirep->state = PirepState::DISPATCH;
            $pirep->save();

            FlightLog::where('pirep_id', $pirep->id)->delete();

            return response()->json(['message' => 'Pirep Cancelled']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Pirep could not be found']);
        }
    }
}
