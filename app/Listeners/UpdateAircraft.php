<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Models\Enums\AircraftState;
use App\Models\Flight;
use App\Services\AircraftService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateAircraft
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
        $aircraftService = new AircraftService();
        $aircraftService->updateAircraftFuel($event->pirep->aircraft_id, $event->pirep->fuel_used);
        $aircraftService->updateAircraftState($event->pirep->aircraft_id, AircraftState::AVAILABLE);
        $aircraftService->updateAircraftHours($event->pirep->aircraft_id, $event->pirep->flight_time);
        $aircraftService->updateAircraftLocation($event->pirep->aircraft_id, $event->pirep->destination_airport_id);
        $aircraftService->updateAircraftLastFlightDate($event->pirep->aircraft_id, $event->pirep->submitted_at);
    }
}
