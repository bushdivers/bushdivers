<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\ContractType;
use Carbon\Carbon;

class StoreContract
{
    public function execute($start, $dest, $distance, $heading, $cargo, $value)
    {
        $contract = new Contract();
        $contract->dep_airport_id = $start;
        $contract->arr_airport_id = $dest;
        $contract->distance = $distance;
        $contract->heading = $heading;
        $contract->contract_value = $value;
        $contract->expires_at = Carbon::now()->addDays(rand(1,8));
        $contract->save();

        $contractCargo = new ContractCargo();
        $contractCargo->contract_id = $contract->id;
        $contractCargo->current_airport_id = $start;
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
