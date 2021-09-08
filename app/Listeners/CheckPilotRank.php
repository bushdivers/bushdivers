<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Services\RankService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckPilotRank
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
        $rankService = new RankService();
        $rankService->checkRank($event->pirep->user_id);
    }
}
