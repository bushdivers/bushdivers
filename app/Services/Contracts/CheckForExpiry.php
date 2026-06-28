<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use Carbon\Carbon;

class CheckForExpiry
{
    public function execute(): void
    {
        $contracts = Contract::where('expires_at', '<', Carbon::now())
            ->where('is_completed', false)
            ->where('user_id', null)
            ->get();

        foreach ($contracts as $contract) {
            // close contract
            if ($contract->active_pirep == null) {
                $contract->delete();
            }
        }
    }
}
