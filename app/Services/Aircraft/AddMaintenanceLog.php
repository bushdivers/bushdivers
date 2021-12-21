<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\Enums\MaintenanceCosts;
use App\Models\Enums\MaintenanceTypes;
use App\Models\MaintenanceLog;

class AddMaintenanceLog
{
    public function execute($aircraftId, $typeId, $userId, $cost, $engineId = null)
    {
        $maintenance = new MaintenanceLog();
        $maintenance->aircraft_id = $aircraftId;
        $maintenance->maintenance_type = $typeId;
        $maintenance->engine_id = $engineId;
        $maintenance->user_id = $userId;
        $maintenance->cost = $cost;
        $maintenance->save();
    }
}
