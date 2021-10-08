<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Models\Flight;
use App\Services\UserService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdatePilotFlights
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
        $userService = new UserService();
        $userService->updatePilotHours($event->pirep->flight_time, $event->pirep->user_id);
        $userService->updatePilotLocation($event->pirep->destination_airport_id, $event->pirep->user_id);
    }
}
