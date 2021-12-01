<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Services\Awards\CheckAwardStatus;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckPilotAwards
{
    protected CheckAwardStatus $checkAwardStatus;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(CheckAwardStatus $checkAwardStatus)
    {
        $this->checkAwardStatus = $checkAwardStatus;
    }

    /**
     * Handle the event.
     *
     * @param  PirepFiled  $event
     * @return void
     */
    public function handle(PirepFiled $event)
    {
        $this->checkAwardStatus->execute($event->pirep->user_id);
    }
}
