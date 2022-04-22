<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\ContractInfo;
use App\Models\Enums\ContractType;
use Carbon\Carbon;

class StoreContract
{
    public function execute(ContractInfo $data, $expiry)
    {
        $cargo = $data->getCargo();
        $contract = new Contract();
        $contract->contract_type_id = 1;
        $contract->dep_airport_id = $data->getStart();
        $contract->arr_airport_id = $data->getDest();
        $contract->distance = $data->getDistance();
        $contract->contract_value = $data->getValue();
        $contract->heading = $data->getHeading();
        $contract->expires_at = $expiry;
        $contract->is_available = 0;
        if ($cargo['type'] == 1) {
            $contract->payload = $cargo['qty'];
        } else {
            $contract->pax = $cargo['qty'];
        }

        if ($data->getCustom()) {
            $contract->user_id = $data->getUserId();
        }

        $contract->save();

        $contractCargo = new ContractCargo();
        $contractCargo->contract_id = $contract->id;
        $contractCargo->current_airport_id = $data->getStart();
        $contractCargo->dep_airport_id = $data->getStart();
        $contractCargo->arr_airport_id = $data->getDest();
        $contractCargo->contract_value = $data->getValue();
        $contractCargo->distance = $data->getDistance();
        $contractCargo->heading = $data->getHeading();
        $contractCargo->contract_value = $data->getValue();
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
