<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Airport;
use App\Models\Fleet;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GenerateAircraft
{
    public function generateAll()
    {
        // generate 8 of each fleet with random wear and airframe / engine time
        $hubs = Airport::where('is_hub', true)->get();
        $fleet = Fleet::all();
        foreach ($hubs as $hub) {
            $airports = DB::select(DB::raw(
            "SELECT *
                        FROM (
                          SELECT
                            airports.*,
                            3956 * ACOS(COS(RADIANS($hub->lat)) * COS(RADIANS(lat)) * COS(RADIANS($hub->lon) - RADIANS(lon)) + SIN(RADIANS($hub->lat)) * SIN(RADIANS(lat))) AS `distance`
                          FROM airports
                          WHERE
                            lat
                              BETWEEN $hub->lat - (300 / 69)
                              AND $hub->lat + (300 / 69)
                            AND lon
                              BETWEEN $hub->lon - (300 / (69 * COS(RADIANS($hub->lat))))
                              AND $hub->lon + (300 / (69* COS(RADIANS($hub->lat))))
                        ) r
                        WHERE distance < 180
                        ORDER BY distance ASC"
            ));

            $allAirports = collect($airports);

            foreach ($fleet as $f) {
                switch ($f->size) {
                    case 'S':
                    case 'M':
                        $n = 12;
                        break;
                    case 'L':
                        $n = 6;
                        break;
                    default:
                        $n = 12;
                }

                $i = 1;
                while ($i <= $n) {
                    $this->generateAircraftDetails($f, $allAirports, $hub->country);
                    $i++;
                }
            }
        }
    }

    public function generateSpecific($type, $location)
    {
        $fleet = Fleet::find($type);
        $airport = Airport::where('identifier', $location)->first();

        $this->generateAircraftDetails($fleet, $airport, $airport->country, 'replace');
    }

    protected function generateAircraftDetails($fleet, $airports, $locale, $type = null)
    {
        if ($type == 'replace') {
            $currentAirport = $airports;
            $identifier = $airports->identifier;
        } else {
            $currentAirport = $airports->random(1);
            $identifier = $currentAirport[0]->identifier;
        }

        $reg = $this->findAvailableReg($locale);
        $randInspection = rand(20,350);
        $airframeTime = rand(2000, 120000);
        $tboTime = $airframeTime > $fleet->tbo_mins ? rand(1200, $fleet->tbo_time) : $airframeTime;
        $checkTime = $airframeTime < 6000 ? $airframeTime : rand(100, 4000);

        $ac = new Aircraft();
        $ac->fleet_id = $fleet->id;
        $ac->current_airport_id = $identifier;
        $ac->hub_id = $identifier;
        $ac->registration = $reg;
        $ac->flight_time_mins = $airframeTime;
        $ac->state = 1;
        $ac->status = 1;
        $ac->owner_id = null;
        $ac->last_inspected_at = Carbon::now()->addDays($randInspection);
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

    protected function findAvailableReg(string $country): string
    {
        $valid = false;
        $reg = '';

        while ($valid == false) {
            if ($country == 'PG' || $country == 'ID') {
                $num = mt_rand(1, 999);
                $num = str_pad($num, 2, 0, STR_PAD_LEFT);
                $reg = 'P2-'.$num;
            } elseif ($country == 'US') {
                $num = mt_rand(1, 9999);
                $num = str_pad($num, 3, 0, STR_PAD_LEFT);
                $reg = 'N'.$num;
            }

            $aircraft = Aircraft::where('registration', $reg)
                ->count();
            if ($aircraft == 0) {
                $valid = true;
            }
        }
        return $reg;
    }
}
