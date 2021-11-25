<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;
use Carbon\Carbon;

class RemoveStaleContracts
{
    public function execute()
    {
        $contracts = Contract::where('user_id', null)
            ->where('is_available', true)
            ->where('is_completed', false)
            ->where('expires_at', '<', Carbon::now())
            ->get();

        foreach ($contracts as $contract) {
            ContractCargo::where('contract_id', $contract->id)->delete();
            $contract->delete();
        }
    }
}
