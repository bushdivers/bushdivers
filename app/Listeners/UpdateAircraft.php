<?php

namespace App\Listeners;

use App\Events\PirepFiled;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Services\Aircraft\ProcessAircraftCondition;
use App\Services\Aircraft\UpdateAircraftFuel;
use App\Services\Aircraft\UpdateAircraftHours;
use App\Services\Aircraft\UpdateAircraftLastFlight;
use App\Services\Aircraft\UpdateAircraftLocation;
use App\Services\Aircraft\UpdateAircraftMaintenanceTimes;
use App\Services\Aircraft\UpdateAircraftState;
use App\Services\Rentals\UpdateRentalAfterFlight;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Tests\Unit\Services\Aircraft\UpdateAircraftDataTest;

class UpdateAircraft
{
    protected UpdateAircraftState $updateAircraftState;
    protected UpdateAircraftFuel $updateAircraftFuel;
    protected UpdateAircraftHours $updateAircraftHours;
    protected UpdateAircraftLocation $updateAircraftLocation;
    protected UpdateAircraftLastFlight $updateAircraftLastFlight;
    protected UpdateAircraftMaintenanceTimes $updateAircraftMaintenanceTimes;
    protected UpdateRentalAfterFlight $updateRentalAfterFlight;
    protected ProcessAircraftCondition $processAircraftCondition;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        UpdateAircraftState $updateAircraftState,
        UpdateAircraftFuel $updateAircraftFuel,
        UpdateAircraftHours $updateAircraftHours,
        UpdateAircraftLocation $updateAircraftLocation,
        UpdateAircraftLastFlight $updateAircraftLastFlight,
        UpdateAircraftMaintenanceTimes $updateAircraftMaintenanceTimes,
        UpdateRentalAfterFlight $updateRentalAfterFlight,
        ProcessAircraftCondition $processAircraftCondition
    )
    {
        $this->updateAircraftState = $updateAircraftState;
        $this->updateAircraftFuel = $updateAircraftFuel;
        $this->updateAircraftHours = $updateAircraftHours;
        $this->updateAircraftLocation = $updateAircraftLocation;
        $this->updateAircraftLastFlight = $updateAircraftLastFlight;
        $this->updateAircraftMaintenanceTimes = $updateAircraftMaintenanceTimes;
        $this->updateRentalAfterFlight = $updateRentalAfterFlight;
        $this->processAircraftCondition = $processAircraftCondition;
    }

    /**
     * Handle the event.
     *
     * @param  PirepFiled  $event
     * @return void
     */
    public function handle(PirepFiled $event)
    {
//        $aircraft = Aircraft::find($event->pirep->aircraft_id);

        if (!$event->pirep->is_rental) {
            $this->updateAircraftState->execute($event->pirep->aircraft_id, AircraftState::AVAILABLE);
            $this->updateAircraftFuel->execute($event->pirep->aircraft_id, $event->pirep->fuel_used);
            $this->updateAircraftHours->execute($event->pirep->aircraft_id, $event->pirep->flight_time);
            $this->updateAircraftLocation->execute($event->pirep->aircraft_id, $event->pirep->destination_airport_id, $event->pirep->current_lat, $event->pirep->current_lon);
            $this->updateAircraftLastFlight->execute($event->pirep->aircraft_id, $event->pirep->submitted_at);
            $this->updateAircraftMaintenanceTimes->execute($event->pirep->aircraft_id, $event->pirep->flight_time);
            $this->processAircraftCondition->execute($event->pirep->aircraft_id, $event->pirep->landing_rate);
        } else {
            $this->updateRentalAfterFlight->execute($event->pirep->aircraft_id, $event->pirep->fuel_used, $event->pirep->destination_airport_id);
        }
    }
}
