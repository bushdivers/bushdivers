<?php

namespace App\Services\Finance;

use App\Models\AccountLedger;

class AddAirlineTransaction
{
    public function execute(int $type, float $total, string|null $memo = null, $pirepId = null, $method = 'debit')
    {
        $transactionTotal = 0;
        if ($method == 'debit') {
            $transactionTotal = -$total;
        } elseif ($method == 'credit') {
            $transactionTotal = $total;
        }

        $ledger = new AccountLedger();
        $ledger->transaction_type = $type;
        $ledger->total = $transactionTotal;
        $ledger->memo = $memo;
        $ledger->pirep_id = $pirepId;
        $ledger->save();
    }
}
