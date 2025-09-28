<?php

namespace App\Services\Airports;

use App\Models\Airport;
use App\Models\Contract;

class CheckHubProgress
{
    public function execute(Airport $hub)
    {
        if ($hub->hub_in_progress && $hub->is_hub) {
            // check all contracts are completed
            $hubContractsCount = Contract::where('hub_airport_id', $hub->id)->where('is_completed', false)->count();
            if ($hubContractsCount === 0){
                $hub->hub_in_progress = false;
                $hub->has_avgas = true;
                $hub->has_jetfuel = true;
                $hub->avgas_qty = null;
                $hub->jetfuel_qty = null;
                $hub->save();
            }
        }
    }
}
