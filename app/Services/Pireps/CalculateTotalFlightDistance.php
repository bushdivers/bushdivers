<?php

namespace App\Services\Pireps;

use App\Models\FlightLog;
use App\Models\Pirep;
use Location\Coordinate;

class CalculateTotalFlightDistance
{
    public function __construct()
    { }

    public function execute(Pirep $pirep): float
    {
        $distance = 0;
        $first = true;

        // find lat/lon for departure
        $pirep->loadMissing('depAirport');
        $dep = $pirep->depAirport;
        $startLat = $dep->lat;
        $startLon = $dep->lon;
        //get initial leg


        $lastCoord = $dep->getCoordinate();

        // find flight logs for pirep
        /** @var FlightLog[] $logs */
        $logs = FlightLog::where('pirep_id', $pirep->id)->get();

        foreach ($logs as $log) {
            // loop through logs and tally up distance between each point
            if ($first) {
                $distance += $dep->distanceTo($log);
                $first = false;
            } else {
                $distance += $log->distanceTo($lastCoord);
            }

            $lastCoord = $log->getCoordinate();
        }

        return $distance;
    }
}
