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

        $numberToGenerate = 1;

        switch ($fleet->popularity) {
            case 1:
                $numberToGenerate = 5;
                break;
            case 2:
                $numberToGenerate = 10;
                break;
            case 3:
                $numberToGenerate = 15;
                break;
        }
        $allIdentifiers = $allAirports->pluck('identifier');
        $currentAircraftAvailable = Aircraft::where('fleet_id', $fleet->id)
            ->where('owner_id', null)
            ->whereIn('current_airport_id', $allIdentifiers)
            ->count();

        $numberToGenerate = $numberToGenerate - $currentAircraftAvailable;

        if ($numberToGenerate > 0) {
            $i = 1;
            while ($i <= $numberToGenerate) {
                $destAirport = $allAirports->random(1);
                $this->generateAircraftDetails->execute($fleet, $destAirport[0], $destAirport[0]->country);
                $i++;
            }
        }
    }

}
