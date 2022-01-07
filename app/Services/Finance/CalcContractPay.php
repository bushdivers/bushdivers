<?php

namespace App\Services\Finance;

use App\Models\Contract;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\FinancialConsts;

class CalcContractPay
{
    protected AddAirlineTransaction $addAirlineTransaction;

    public function __construct(AddAirlineTransaction $addAirlineTransaction)
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
    }

    public function execute($contractId, $pirep = null, $rental = false, $privatePlane = false): float
    {
        $contract = Contract::find($contractId);
        // company pay
        $companyPay = $contract->contract_value;
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractIncome, $companyPay, 'Contract Pay: '. $contractId, $pirep, 'credit');
        // pilot pay
        if ($rental || $privatePlane) {
            $pilotPay = (60 / 100) * $contract->contract_value;
        } else {
            $pilotPay = (FinancialConsts::PilotPay / 100) * $contract->contract_value;
        }
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractExpenditure, $pilotPay, 'Pilot Pay: '. $contractId, $pirep);
        return $pilotPay;
    }
}
