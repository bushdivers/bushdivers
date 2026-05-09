<?php

namespace App\Services\Airports;

use App\Models\Airport;
use Illuminate\Support\Facades\Auth;

class CalcCostOfJumpseat
{
    public function __construct()
    { }

    public function execute(string $fromIcao, string $toIcao): array
    {
        $start = Airport::where('identifier', $fromIcao)->firstOrFail();
        $end = Airport::where('identifier', $toIcao)->firstOrFail();

        $distance = $start->distanceTo($end);

        if ($start->is_hub && $end->is_hub) {
            $cost = 0.00;
        } else {
            $cost = round($distance * 0.25,2);
        }

        return ['cost' => $cost, 'distance' => $distance];
    }
}
