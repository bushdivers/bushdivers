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
use App\Services\Airports\CheckHubProgress;
use App\Services\Contracts\UpdateContractCargoProgress;
use App\Services\Finance\ProcessPirepFinancials;
use App\Services\Pireps\CalculatePirepPoints;
use App\Services\Pireps\SetPirepTotalScore;
use App\Services\Tours\CheckTourProgress;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubmitPirepController extends Controller
{
    protected UpdateContractCargoProgress $updateContractCargoProgress;
    protected ProcessPirepFinancials $processPirepFinancials;
    protected CalculatePirepPoints $calculatePirepPoints;
    protected SetPirepTotalScore $setPirepTotalScore;
    protected CheckTourProgress $checkTourProgress;
    protected CheckHubProgress $checkHubProgress;

    public function __construct(
        UpdateContractCargoProgress $updateContractCargoProgress,
        ProcessPirepFinancials $processPirepFinancials,
        CalculatePirepPoints $calculatePirepPoints,
        SetPirepTotalScore $setPirepTotalScore,
        CheckTourProgress $checkTourProgress,
        CheckHubProgress $checkHubProgress
    ) {
        $this->updateContractCargoProgress = $updateContractCargoProgress;
        $this->processPirepFinancials = $processPirepFinancials;
        $this->calculatePirepPoints = $calculatePirepPoints;
        $this->setPirepTotalScore = $setPirepTotalScore;
        $this->checkTourProgress = $checkTourProgress;
        $this->checkHubProgress = $checkHubProgress;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        try
        {
            $pirep = Pirep::findOrFail($request->pirep_id);

            $agent = $request->userAgent();
            if (!preg_match('/^\w+\/\d{1,2}\.\d{1,2}\.\d{1,2}\.\d{1,2}$/', $agent))
                $agent = null;

            DB::transaction(function () use ($request, $pirep, $agent) {

                $startTime = Carbon::parse($request->block_off_time);
                $endTime = Carbon::parse($request->block_on_time);
                $duration = $startTime->diffInMinutes($endTime);

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
                $pirep->aircraft_used = $request->aircraft_used;
                $pirep->sim_used = $request->sim_used;
                $pirep->bt_version = $agent;
                $pirep->engine_active_start = $request->engine_hotstart ?? false;
                $pirep->save();

                if (!$pirep->is_empty) {
                    // update cargo and contract
                    $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
                    foreach ($pc as $c) {
                        $contractCargo = Contract::find($c->contract_cargo_id);
                        $this->updateContractCargoProgress->execute($contractCargo->id, $pirep->destination_airport_id, $pirep->id);
                    }
                    $this->checkHubProgress->execute($pirep->destination_airport_id);
                }

                if ($pirep->tour_id)
                    $this->checkTourProgress->execute($pirep);

                // process points and financials
                $this->processPirepFinancials->execute($pirep);
                $this->calculatePirepPoints->execute($pirep);
                // add total to pirep
                $this->setPirepTotalScore->execute($pirep);
            }, 3);

            // dispatch completed event (updates cargo/contract, resets aircraft, checks rank and awards)
            PirepFiled::dispatch($pirep);

            return response()->json(['message' => 'Pirep successfully submitted']);
        }
        catch (ModelNotFoundException $e)
        {
            return response()->json(['message' => 'Pirep not found'], 404);
        }
        catch (\Exception $e)
        {
            Log::error($e->getMessage(), $e->getTrace());
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 400);
        }
    }
}
