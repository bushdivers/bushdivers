<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;

class CloseContract
{
    public function execute($contractId)
    {
        $contract = Contract::find($contractId);
        ContractCargo::where('contract_id', $contractId)->update([
            'is_available' => false
        ]);
        $contract->is_available = 0;
        $contract->user_id = null;
        $contract->save();
    }
}
