<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Airport;
use App\Models\Fleet;
use App\Services\Airports\FindAirportsWithinDistance;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GenerateAircraft
{
    protected FindAirportsWithinDistance $findAirportsWithinDistance;
    protected GenerateAircraftDetails $generateAircraftDetails;

    public function __construct(FindAirportsWithinDistance $findAirportsWithinDistance, GenerateAircraftDetails $generateAircraftDetails)
    {
        $this->findAirportsWithinDistance = $findAirportsWithinDistance;
        $this->generateAircraftDetails = $generateAircraftDetails;
    }

    public function execute($type, $location): void
    {
        $fleet = Fleet::find($type);
        $allAirports =  $this->findAirportsWithinDistance->execute($location, 0, 300);

        $numberToGenerate = 0;

        // initial popularity
        $popularityScore = 0;
        switch ($fleet->popularity) {
            case 1:
                $popularityScore = 5;
                break;
            case 2:
                $popularityScore = 10;
                break;
            case 3:
                $popularityScore = 15;
                break;
        }

        $sizeScore = 0;
        switch ($fleet->size) {
            case 'S':
                $sizeScore = 15;
                break;
            case 'M':
                $sizeScore = 10;
                break;
            case 'L':
                $sizeScore = 5;
                break;
        }

        $numberToGenerate = round(($popularityScore + $sizeScore) / 2);


        $allIdentifiers = $allAirports->pluck('identifier');
        $currentAircraftAvailable = Aircraft::where('fleet_id', $fleet->id)
            ->where('owner_id', null)
            ->whereIn('current_airport_id', $allIdentifiers)
            ->count();

        $numberToGenerate = $numberToGenerate - $currentAircraftAvailable;

        if ($numberToGenerate > 0) {
            $i = 1;
            while ($i <= $numberToGenerate) {
                $destAirport = $allAirports->where('size', '>=', 3)->random(1);
                $this->generateAircraftDetails->execute($fleet, $destAirport[0], $destAirport[0]->country);
                $i++;
            }
        }
    }

}
