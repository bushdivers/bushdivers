<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Services\User\CheckUserRank;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckPilotRank
{
    protected CheckUserRank $checkUserRank;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(CheckUserRank $checkUserRank)
    {
        $this->checkUserRank = $checkUserRank;
    }

    /**
     * Handle the event.
     *
     * @param  PirepFiled  $event
     * @return void
     */
    public function handle(PirepFiled $event)
    {
        $this->checkUserRank->execute($event->pirep->user_id);
    }
}
