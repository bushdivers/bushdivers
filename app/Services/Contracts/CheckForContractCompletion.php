<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use Carbon\Carbon;

class CheckForContractCompletion
{
    public function execute($contract)
    {
        $cargo = ContractCargo::where('contract_id', $contract->id)->count();
        $cargoCompleted = ContractCargo::where('is_completed', true)->where('contract_id', $contract->id)->count();
        $con = Contract::find($contract->id);

        if ($cargo == $cargoCompleted) {
            $con->is_completed = true;
            $con->completed_at = Carbon::now();
            $con->save();
        }
    }
}
