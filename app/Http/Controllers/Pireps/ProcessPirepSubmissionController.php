<?php

namespace App\Http\Controllers\Pireps;

use App\Events\PirepFiled;
use App\Http\Requests\ManualPirepRequest;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Services\Airports\CheckHubProgress;
use App\Services\Contracts\UpdateContractCargoProgress;
use App\Services\Finance\ProcessPirepFinancials;
use App\Services\Pireps\CalculatePirepPoints;
use App\Services\Pireps\SetPirepTotalScore;
use App\Services\Tours\CheckTourProgress;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ProcessPirepSubmissionController extends Controller
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
    )
    {
        $this->updateContractCargoProgress = $updateContractCargoProgress;
        $this->processPirepFinancials = $processPirepFinancials;
        $this->calculatePirepPoints = $calculatePirepPoints;
        $this->setPirepTotalScore = $setPirepTotalScore;
        $this->checkTourProgress = $checkTourProgress;
        $this->checkHubProgress = $checkHubProgress;
    }

    /**
     * Handle a manual pirep submission
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(ManualPirepRequest $request): RedirectResponse
    {
        try {
            $pirep = Pirep::where('id', $request->pirep_id)
                ->where('user_id', Auth::user()->id)
                ->whereIn('state', [PirepState::DISPATCH, PirepState::IN_PROGRESS])
                ->firstOrFail();


            $blockOffTime = Carbon::now('UTC')->subMinutes($request->flight_time_mins);

            $pirep->fuel_used = abs($request->fuel_used);
            $pirep->distance = $request->distance;
            $pirep->flight_time = $request->flight_time_mins;
            $pirep->landing_rate = 0;
            $pirep->landing_pitch = 0;
            $pirep->landing_bank = 0;
            $pirep->landing_lat = $pirep->current_lat;
            $pirep->landing_lon = $pirep->current_lon;
            $pirep->state = PirepState::REVIEW;
            $pirep->status = PirepStatus::ARRIVED;
            $pirep->submitted_at = Carbon::now('UTC');
            $pirep->block_off_time = $blockOffTime;
            $pirep->block_on_time = Carbon::now('UTC');
            $pirep->is_manual = true;
            $pirep->sim_used = null;
            $pirep->bt_version = 'Manual PIREP';
            $pirep->save();

            $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
            foreach ($pc as $c) {
                $contractCargo = Contract::find($c->contract_cargo_id);
                $this->updateContractCargoProgress->execute($contractCargo->id, $pirep->destination_airport_id, $pirep->id);
                $this->checkHubProgress->execute($pirep->destination_airport_id);
            }

            // process points and financials
            if ($pirep->tour_id) {
                $this->checkTourProgress->execute($pirep);
            }
            $this->processPirepFinancials->execute($pirep);
            $this->calculatePirepPoints->execute($pirep);
            // add total to pirep
            $this->setPirepTotalScore->execute($pirep);

            PirepFiled::dispatch($pirep);
        } catch (ModelNotFoundException) {
            return redirect()->back()->with(['error' => 'Incorrect dispatch/pirep id']);
        } catch (\Exception) {
            return redirect()->back()->with(['error' => 'Cannot process pirep']);
        }


        return redirect('/logbook')->with(['success' => 'Pirep submitted for review']);
    }
}
