<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\Enums\MaintenanceCosts;
use App\Models\Enums\MaintenanceTypes;
use App\Models\MaintenanceLog;

class AddMaintenanceLog
{
    public function execute($aircraftId, $aircraftSize, $typeId, $userId, $engineId = null): float
    {
        $cost = 0.00;
        if ($typeId == MaintenanceTypes::Maintenance100hr) {
            $cost = MaintenanceCosts::Cost100hr;
        } elseif ($typeId == MaintenanceTypes::MaintenanceTBO) {
            switch ($aircraftSize) {
                case 'S':
                    $cost = MaintenanceCosts::CostTBOSmall;
                    break;
                case 'M':
                    $cost = MaintenanceCosts::CostTBOMedium;
                    break;
                case 'L':
                    $cost = MaintenanceCosts::CostTBOLarge;
                    break;
            }
        }

        $maintenance = new MaintenanceLog();
        $maintenance->aircraft_id = $aircraftId;
        $maintenance->maintenance_type = $typeId;
        $maintenance->engine_id = $engineId;
        $maintenance->user_id = $userId;
        $maintenance->cost = $cost;
        $maintenance->save();

        return $cost;
    }
}
