<?php

namespace App\Services\Aircraft;

use App\Models\Enums\MaintenanceCosts;
use App\Models\Enums\MaintenanceTypes;

class GetMaintenanceCost
{
    public function execute($typeId, $aircraftSize): float
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
        } elseif ($typeId == MaintenanceTypes::Annual) {
            $cost = MaintenanceCosts::CostAnnual;
        } elseif ($typeId == MaintenanceTypes::GeneralMaintenance) {
            $cost = MaintenanceCosts::CostGeneral;
        } elseif ($typeId == MaintenanceTypes::EngineMaintenance) {
            $cost = MaintenanceCosts::CostEngine;
        }

        return $cost;
    }
}
