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
        $contract->contract_type_id = 1;
        $contract->dep_airport_id = $start;
        $contract->arr_airport_id = $dest;
        $contract->distance = $distance;
        $contract->contract_value = $value;
        $contract->heading = $heading;
        $contract->expires_at = Carbon::now()->addDays(rand(1,8));
        if ($cargo['type'] == 1) {
            $contract->payload = $cargo['qty'];
        } else {
            $contract->pax = $cargo['qty'];
        }

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
        $contractCargo->distance = $distance;
        $contractCargo->heading = $heading;
        $contractCargo->contract_value = $value;
        if ($cargo['type'] == 1) {
            $contractCargo->cargo_type_id = ContractType::Cargo;
        } else {
            $contractCargo->cargo_type_id = ContractType::Passenger;
        }
        $contractCargo->cargo = $cargo['name'];
        $contractCargo->cargo_qty = $cargo['qty'];

        $contractCargo->save();
    }
}
