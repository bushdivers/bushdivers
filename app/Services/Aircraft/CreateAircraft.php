<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Fleet;
use Carbon\Carbon;
use Illuminate\Support\Str;

class CreateAircraft
{
    public function execute($data, $user, $location): Aircraft
    {
        $fleet = Fleet::find($data['id']);
        // create aircraft
        $aircraft = new Aircraft();
        $aircraft->fleet_id = $data['id'];
        $aircraft->current_airport_id = Str::upper($data['deliveryIcao']);
        $aircraft->registration = Str::upper($data['reg']);
        $aircraft->state = AircraftState::AVAILABLE;
        $aircraft->status = AircraftStatus::ACTIVE;
        $aircraft->hub_id = Str::upper($data['hub']);
        $aircraft->last_inspected_at = Carbon::now();
        $aircraft->owner_id = $user->id ?? 0;
        $aircraft->last_lat = $location->lat;
        $aircraft->last_lon = $location->lon;
        $aircraft->save();

        $numEngines = $fleet->number_of_engines;

        for ($i = 0; $i < $numEngines; $i++) {
            $engine = new AircraftEngine();
            $engine->aircraft_id = $aircraft->id;
            $engine->engine_no = $i + 1;
            $engine->save();
        }

        return $aircraft;
    }
}
