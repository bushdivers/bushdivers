<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Services\PirepService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CalculatePay
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
        $pirepService = new PirepService();
        $pirepService->calculatePilotPay($event->pirep);
    }
}
