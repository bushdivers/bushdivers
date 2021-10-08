<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Services\AwardService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckPilotAwards
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  PirepFiled  $event
     * @return void
     */
    public function handle(PirepFiled $event)
    {
        $awardService = new AwardService();
        $awardService->checkAwards($event->pirep->user_id);
    }
}
