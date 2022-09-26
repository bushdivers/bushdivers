<?php

namespace App\Http\Controllers\Bot;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BotController extends Controller
{
    public function addParticipantToTreasureHunt(Request $request): JsonResponse
    {
        $pilot = DB::table('th_participants')
            ->where('pilot', '=', $request->pilot)
            ->count('*');

        if ($pilot > 0) {
            return response()->json(['message' => 'Pilot already added'], 422);
        } else {
            DB::table('th_participants')->insert([
                'pilot' => $request->pilot
            ]);
            return response()->json(['message' => 'Pilot added'], 201);
        }
    }

    public function getTreasureHuntPirep($pirepId): JsonResponse
    {
        $pirep = Pirep::where('id', $pirepId)
            ->where('is_manual', false)
            ->where('state', PirepState::ACCEPTED)
            ->firstOrFail();
        return response()->json(['departure' => $pirep->departure_airport_id, 'arrival' => $pirep->destination_airport_id, 'pirep' => $pirepId]);
    }

    public function comparePirepToTreasureHuntClue(Request $request): JsonResponse
    {
        $participant = DB::table('th_participants')
            ->where('pilot', '=', $request->participantId)
            ->first();

        $clue = DB::table('th_clues')
            ->where('clue_order', '=', $participant->progress)
            ->first();

        $nextClueNo = $participant->progress + 1;

        if ($clue->answer == $request->icao) {
            DB::table('th_participants')
                ->where('pilot', '=', $request->participantId)
                ->update(['progress' => $nextClueNo]);

            $nextClue = DB::table('th_clues')
                ->where('clue_order', '=', $nextClueNo)
                ->first();

            if ($nextClue) {
                return response()->json(['clue' => $nextClue->clue, 'clue_number' => $nextClue->clue_order]);
            } else {
                DB::table('th_participants')
                    ->where('pilot', '=', $request->participantId)
                    ->update(['is_completed' => true]);
                return response()->json(['message' => 'no more clues'], 404);
            }
        }
        return response()->json(['message' => 'Incorrect answer'], 422);
    }

    public function getTreasureHuntClue($nextClueNo): JsonResponse
    {
        $clue = DB::table('th_clues')
            ->where('clue_order', '=', $nextClueNo)
            ->first();
        if ($clue) {
            return response()->json(['clue' => $clue->clue, 'clue_number' => $clue->clue_order]);
        } else {
            return response()->json(['message' => 'no more clues'], 404);
        }
    }
}
