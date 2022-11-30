<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\ContractCargo;

class CloseContract
{
    public function execute($contractId)
    {
        Contract::destroy($contractId);
    }
}
