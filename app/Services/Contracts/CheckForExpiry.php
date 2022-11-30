<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\TransactionTypes;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use Carbon\Carbon;

class CheckForExpiry
{
    protected CloseContract $closeContract;
    public function __construct(CloseContract $closeContract)
    {
        $this->closeContract = $closeContract;
    }

    public function execute()
    {
        $contracts = Contract::where('expires_at', '<', Carbon::now())
            ->where('is_completed', false)
            ->where('user_id', null)
            ->get();

        foreach ($contracts as $contract) {
            // close contract
            if ($contract->active_pirep == null) {
                $this->closeContract->execute($contract->id);
            }
        }
    }
}
