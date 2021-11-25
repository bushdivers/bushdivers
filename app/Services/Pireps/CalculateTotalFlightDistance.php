<?php

namespace App\Services\Pireps;

use App\Models\Airport;
use App\Models\FlightLog;
use App\Services\Airports\CalcDistanceBetweenPoints;

class CalculateTotalFlightDistance
{
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;

    public function __construct(CalcDistanceBetweenPoints $calcDistanceBetweenPoints)
    {
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
    }

    public function execute($pirep): float
    {
        $distance = 0;
        $first = true;

        // find lat/lon for departure
        $dep = Airport::where('identifier', $pirep->departure_airport_id)->first();
        $startLat = $dep->lat;
        $startLon = $dep->lon;
        //get initial leg


        $lastLat = 0.00;
        $lastLon = 0.00;

        // find flight logs for pirep
        $logs = FlightLog::where('pirep_id', $pirep->id)->get();
        $i = 1;
        foreach ($logs as $log) {
            // loop through logs and tally up distance between each point
            if ($first) {
                $distance += $this->calcDistanceBetweenPoints->execute($startLat, $startLon, $log->lat, $log->lon);
                $first = false;
            } else {
                $distance += $this->calcDistanceBetweenPoints->execute($lastLat, $lastLon, $log->lat, $log->lon);
            }

            if ($i < $logs->count()) {
                $lastLat = $log->lat;
                $lastLon = $log->lon;
            }
            $i++;
        }

        return $distance;
    }
}
