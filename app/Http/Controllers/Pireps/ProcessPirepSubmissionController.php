<?php

namespace App\Http\Controllers\Pireps;

use App\Events\PirepFiled;
use App\Http\Requests\ManualPirepRequest;
use App\Models\ContractCargo;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Services\Contracts\UpdateContractCargoProgress;
use App\Services\Finance\ProcessPirepFinancials;
use App\Services\Pireps\CalculatePirepPoints;
use App\Services\Pireps\SetPirepTotalScore;
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

    public function __construct(
        UpdateContractCargoProgress $updateContractCargoProgress,
        ProcessPirepFinancials $processPirepFinancials,
        CalculatePirepPoints $calculatePirepPoints,
        SetPirepTotalScore $setPirepTotalScore
    )
    {
        $this->updateContractCargoProgress = $updateContractCargoProgress;
        $this->processPirepFinancials = $processPirepFinancials;
        $this->calculatePirepPoints = $calculatePirepPoints;
        $this->setPirepTotalScore = $setPirepTotalScore;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(ManualPirepRequest $request): RedirectResponse
    {
        try {
            $pirep = Pirep::where('id', $request->pirep_id)
                ->where('user_id', Auth::user()->id)
                ->where('state', '<>', PirepState::ACCEPTED)
                ->firstOrFail();

            $blockOffTime = Carbon::now('UTC')->subMinutes($request->flight_time_mins);

            $pirep->fuel_used = $request->fuel_used;
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
            $pirep->save();

            $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
            foreach ($pc as $c) {
                $contractCargo = ContractCargo::find($c->contract_cargo_id);
                $this->updateContractCargoProgress->execute($contractCargo->id, $pirep->destination_airport_id, $pirep->id);
            }

            // process points and financials
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
