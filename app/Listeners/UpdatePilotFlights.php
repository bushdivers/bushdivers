<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Services\User\UpdateUserHours;
use App\Services\User\UpdateUserLocation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdatePilotFlights
{
    protected UpdateUserHours $updateUserHours;
    protected UpdateUserLocation $updateUserLocation;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        UpdateUserHours $updateUserHours,
        UpdateUserLocation $updateUserLocation
    )
    {
        $this->updateUserHours = $updateUserHours;
        $this->updateUserLocation = $updateUserLocation;
    }

    /**
     * Handle the event.
     *
     * @param  PirepFiled  $event
     * @return void
     */
    public function handle(PirepFiled $event)
    {
        $this->updateUserHours->execute($event->pirep->flight_time, $event->pirep->user_id);
        $this->updateUserLocation->execute($event->pirep->destination_airport_id, $event->pirep->user_id);
    }
}
