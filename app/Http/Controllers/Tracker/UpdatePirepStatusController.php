<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UpdatePirepStatusController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $pirep = Pirep::find($request->pirep_id);
        $pirep->status = $request->status;
        $pirep->state = PirepState::IN_PROGRESS;
        $pirep->save();

        return response()->json(['message' => 'Updated status']);
    }
}
