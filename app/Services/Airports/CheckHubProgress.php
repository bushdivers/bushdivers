<?php

namespace App\Services\Airports;

use App\Models\Airport;
use App\Models\Contract;

class CheckHubProgress
{
    public function execute($hub)
    {
        $airport = Airport::where('identifier', $hub)->first();
        if ($airport->hub_in_progress && $airport->is_hub) {
            // check all contracts are completed
            $hubContractsCount = Contract::where('airport', $hub)->where('is_completed', false)->count();
            if ($hubContractsCount === 0){
                $airport->hub_in_progress = false;
                $airport->save();
            }
        }
    }
}
