<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use Carbon\Carbon;

class GenerateAircraftDetails
{
    protected FindAvailableRegistration $findAvailableReg;

    public function __construct(FindAvailableRegistration $findAvailableReg)
    {
        $this->findAvailableReg = $findAvailableReg;
    }

    public function execute($fleet, $airport, $locale): void
    {
        $reg = $this->findAvailableReg->execute($locale);
        $randInspection = rand(20,350);
        $airframeTime = rand(2000, 120000);
        $tboTime = $airframeTime > $fleet->tbo_mins ? rand(1200, $fleet->tbo_time) : $airframeTime;
        $checkTime = $airframeTime < 6000 ? $airframeTime : rand(100, 4000);

        $ac = new Aircraft();
        $ac->fleet_id = $fleet->id;
        $ac->current_airport_id = $airport->identifier;
        $ac->hub_id = $airport->identifier;
        $ac->registration = $reg;
        $ac->flight_time_mins = $airframeTime;
        $ac->state = 1;
        $ac->status = 1;
        $ac->owner_id = null;
        $ac->last_inspected_at = Carbon::now()->subDays($randInspection);
        $ac->wear = rand(40, 95);
        $ac->save();
        $e = 1;
        while ($e <= $fleet->number_of_engines) {
            $engine = new AircraftEngine();
            $engine->aircraft_id = $ac->id;
            $engine->engine_no = $e;
            $engine->mins_since_tbo = $tboTime;
            $engine->mins_since_100hr = $checkTime;
            $engine->wear = rand(40, 95);
            $engine->save();

            if ($engine->wear < 80 && $engine->mins_since_100hr > 3000) {
                $engineMultiplier = 0.25;
            } else {
                $engineMultiplier = 1;
            }
            $e++;
        }

        if ($ac->flight_time_mins > 80000 && $ac->wear < 70) {
            $acMultiplier = 0.25;
        } else {
            $acMultiplier = 1;
        }

        $multiplier = $engineMultiplier + $acMultiplier;
        if ($multiplier < 1) {
            $price = rand(($fleet->used_low_price - 10000), (($fleet->used_low_price + 10000)));
        } elseif ($multiplier < 2 && $multiplier >= 1) {
            $price = rand(($fleet->used_low_price + 15000), (($fleet->used_low_price + 50000)));
        } else {
            $price = rand(($fleet->used_high_price - 30000), ($fleet->used_high_price + 15000));
        }

        $ac->sale_price = $price;
        $ac->save();
    }


}
