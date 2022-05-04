<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Fleet;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CreateAircraft
{
    public function execute($data, $userId, $isFianance = false): Aircraft
    {
        $fleet = Fleet::find($data['id']);
        // create aircraft
        $aircraft = new Aircraft();
        $aircraft->fleet_id = $data['id'];
        $aircraft->current_airport_id = $data['deliveryIcao'];
        $aircraft->registration = $data['reg'];
        $aircraft->state = 1;
        $aircraft->status = 1;
        $aircraft->hub_id = $data['hub'];
        $aircraft->last_inspected_at = Carbon::now();
        $aircraft->is_financed = $isFianance;
        $aircraft->owner_id = $userId;
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
