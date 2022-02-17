<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\ContractType;
use Carbon\Carbon;

class StoreContract
{
    public function execute($start, $dest, $distance, $heading, $cargo, $value, $custom = false, $userId = null)
    {
        $contract = new Contract();
        $contract->dep_airport_id = $start;
        $contract->arr_airport_id = $dest;
        $contract->distance = $distance;
        $contract->heading = $heading;
        $contract->expires_at = Carbon::now()->addDays(rand(1,8));

        if ($custom) {
            $contract->is_available = 0;
            $contract->user_id = $userId;
        }

        $contract->save();

        $contractCargo = new ContractCargo();
        $contractCargo->contract_id = $contract->id;
        $contractCargo->current_airport_id = $start;
        $contractCargo->dep_airport_id = $start;
        $contractCargo->arr_airport_id = $dest;
        $contractCargo->contract_value = $value;
        if ($cargo['type'] == 1) {
            $contractCargo->contract_type_id = ContractType::Cargo;
        } else {
            $contractCargo->contract_type_id = ContractType::Passenger;
        }
        $contractCargo->cargo = $cargo['name'];
        $contractCargo->cargo_qty = $cargo['qty'];
        $contractCargo->save();
    }
}
