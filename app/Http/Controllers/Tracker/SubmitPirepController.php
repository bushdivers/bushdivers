<?php

namespace App\Http\Controllers\Tracker;

use App\Events\PirepFiled;
use App\Http\Controllers\Controller;
use App\Models\AccountLedger;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Point;
use App\Models\User;
use App\Services\ContractService;
use App\Services\FinancialsService;
use App\Services\PirepService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubmitPirepController extends Controller
{
    protected FinancialsService $financialsService;
    protected PirepService $pirepService;

    public function __construct(FinancialsService $financialsService, PirepService $pirepService)
    {
        $this->financialsService = $financialsService;
        $this->pirepService = $pirepService;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $pirep = Pirep::find($request->pirep_id);

        try {
            // calculate coordinate points in flight logs
//            $distance = $pirepService->calculateTotalFlightDistance($pirep);
            $startTime = Carbon::parse($request->block_off_time);
            $endTime = Carbon::parse($request->block_on_time);
            $duration = $startTime->diffInMinutes($endTime);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        try {
            // set pirep status to completed
            $pirep->fuel_used = $request->fuel_used;
            $pirep->distance = $request->distance;
            $pirep->flight_time = $duration;
            $pirep->landing_rate = $request->landing_rate;
            $pirep->landing_pitch = $request->landing_pitch;
            $pirep->landing_bank = $request->landing_bank;
            $pirep->landing_lat = $request->landing_lat;
            $pirep->landing_lon = $request->landing_lon;
            $pirep->state = PirepState::ACCEPTED;
            $pirep->status = PirepStatus::ARRIVED;
            $pirep->submitted_at = Carbon::now('UTC');
            $pirep->block_off_time = $startTime;
            $pirep->block_on_time = $endTime;
            $pirep->save();
        } catch (\Exception $e) {
            $this->rollbackSubmission(1, $request);
            return response()->json(['message' => $e->getMessage()], 500);
        }

        if (!$pirep->is_empty) {
            try {
                // update cargo and contract
                $contractService = new ContractService();
                $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
                foreach ($pc as $c) {
                    $contractCargo = ContractCargo::find($c->contract_cargo_id);
                    $contractService->updateCargo($contractCargo->id, $pirep->destination_airport_id);
                }
            } catch (\Exception $e) {
                $this->rollbackSubmission(2, $request);
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }

        try {
            // process points and financials
            $this->financialsService->processPirepFinancials($pirep);
            $this->pirepService->calculatePoints($pirep);
            // add total to pirep
            $this->pirepService->updatePirepTotalScore($pirep);
        } catch (\Exception $e) {
            $this->rollbackSubmission(3, $request);
            return response()->json(['message' => $e->getMessage()], 500);
        }

        // dispatch completed event (updates cargo/contract, resets aircraft, checks rank and awards)
        PirepFiled::dispatch($pirep);

        return response()->json(['message' => 'Pirep successfully filed']);
    }

    protected function rollbackSubmission(int $stage, $pirep)
    {
        // pirep reset
        $p = Pirep::find($pirep->id);
        $score = $p->score;
        $p->fuel_used = null;
        $p->distance = null;
        $p->flight_time = null;
        $p->landing_rate = null;
        $p->state = PirepState::IN_PROGRESS;
        $p->status = PirepStatus::BOARDING;
        $p->submitted_at = null;
        $p->block_off_time = null;
        $p->block_on_time = null;
        $p->score = null;
        $p->save();

        // uncomplete contracts
        $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
        foreach ($pc as $c) {
            $contractCargo = ContractCargo::find($c->contract_cargo_id);
            $contractCargo->is_completed = false;
            $contractCargo->completed_at = null;
            $contractCargo->save();
            $contract = Contract::find($contractCargo->contract_id);
            $contract->is_completed = false;
            $contract->completed_at = null;
            $contract->save();
        }
        // remove financials
        AccountLedger::where('pirep_id', $pirep->id)->destroy();

        // remove points
        Point::where('pirep_id', $pirep->id)->destroy();

        $user = User::find($pirep->user_id);
        $user->points = $user->points - $score;
        $user->save();

    }
}
