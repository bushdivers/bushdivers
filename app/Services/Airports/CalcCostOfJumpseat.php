<?php

namespace App\Services\Airports;

use App\Models\Airport;
use Illuminate\Support\Facades\Auth;

class CalcCostOfJumpseat
{
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;

    public function __construct(CalcDistanceBetweenPoints $calcDistanceBetweenPoints)
    {
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
    }

    public function execute(string $from, string $to): array
    {
        $start = Airport::where('identifier', $from)->firstOrFail();
        $end = Airport::where('identifier', $to)->firstOrFail();

        $distance = $this->calcDistanceBetweenPoints->execute($start->lat, $start->lon, $end->lat, $end->lon);

        if ($start->is_hub && $end->is_hub) {
            $cost = 0.00;
        } else {
            $cost = round($distance * 0.25,2);
        }

        return ['cost' => $cost, 'distance' => $distance];
    }
}
