<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\ContractInfo;
use App\Models\Enums\ContractType;
use Carbon\Carbon;

class StoreContracts
{
    public function execute($data, $isAvailable = true, $isCustom = false, $userId = null)
    {
        foreach ($data as $contractInfo) {
            if (!$contractInfo)
                continue;

            $contract = new Contract();
            $contract->contract_type_id = 1;
            $contract->dep_airport_id = $contractInfo['departure'];
            $contract->current_airport_id = $contractInfo['departure'];
            $contract->arr_airport_id = $contractInfo['destination'];
            $contract->distance = $contractInfo['distance'];
            $contract->contract_value = $contractInfo['contract_value'];
            $contract->cargo_type = $contractInfo['cargo_type'];
            $contract->cargo = $contractInfo['cargo'];
            $contract->cargo_qty = $contractInfo['cargo_qty'];
            $contract->heading = $contractInfo['heading'];
            $contract->expires_at = $contractInfo['expires_at'];
            $contract->is_available = $isAvailable;
            if ($contractInfo['cargo_type'] == 1) {
                $contract->payload = $contractInfo['cargo_qty'];
            } else {
                $contract->pax = $contractInfo['cargo_qty'];
            }
            if ($isCustom) {
                $contract->user_id = $userId;
                $contract->is_custom = true;
            }

            $contract->save();
        }
    }
}
