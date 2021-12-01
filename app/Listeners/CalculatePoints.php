<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Services\Pireps\CalculatePirepPoints;
use App\Services\Pireps\SetPirepTotalScore;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CalculatePoints
{
    protected CalculatePirepPoints $calculatePirepPoints;
    protected SetPirepTotalScore $setPirepTotalScore;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        CalculatePirepPoints $calculatePirepPoints,
        SetPirepTotalScore $setPirepTotalScore
    )
    {
        $this->calculatePirepPoints = $calculatePirepPoints;
        $this->setPirepTotalScore = $setPirepTotalScore;
    }

    /**
     * Handle the event.
     *
     * @param  PirepFiled  $event
     * @return void
     */
    public function handle(PirepFiled $event)
    {
        $this->calculatePirepPoints->execute($event->pirep);
        // add total to pirep
        $this->setPirepTotalScore->execute($event->pirep);

    }
}
