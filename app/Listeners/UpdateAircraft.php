<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Services\Aircraft\ProcessAircraftCondition;
use App\Services\Aircraft\UpdateAircraftFerry;
use App\Services\Aircraft\UpdateAircraftMaintenanceTimes;
use App\Services\Aircraft\UpdateAircraftAfterFlight;
use App\Services\Rentals\UpdateRentalAfterFlight;

class UpdateAircraft
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        protected UpdateAircraftAfterFlight $UpdateAircraftAfterFlight,
        protected UpdateAircraftMaintenanceTimes $updateAircraftMaintenanceTimes,
        protected UpdateRentalAfterFlight $updateRentalAfterFlight,
        protected ProcessAircraftCondition $processAircraftCondition,
        protected UpdateAircraftFerry $updateAircraftFerry
    ) { }

    /**
     * Handle the event.
     *
     * @param  PirepFiled  $event
     * @return void
     */
    public function handle(PirepFiled $event)
    {
        if (!$event->pirep->is_rental) {
            $aircraft = Aircraft::findOrFail($event->pirep->aircraft_id);
            $this->UpdateAircraftAfterFlight->execute($aircraft, $event->pirep);
            $this->updateAircraftMaintenanceTimes->execute($aircraft, $event->pirep->flight_time);
            $this->processAircraftCondition->execute($aircraft, $event->pirep->landing_rate);
            $this->updateAircraftFerry->execute($aircraft, $event->pirep->arrAirport);
        } else {
            $this->updateRentalAfterFlight->execute($event->pirep->aircraft_id, $event->pirep->fuel_used, $event->pirep->arrAirport->identifier);
        }
    }
}
