<?php

namespace App\Services\Finance;

use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\FinancialConsts;
use Carbon\Carbon;

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
        $companyPay = ContractCargo::where('contract_id', $contractId)->sum('contract_value');
        if (Carbon::now()->greaterThan($contract->expires_at)) {
            $companyPay = round($companyPay - ($companyPay * FinancialConsts::ExpiryMultiplier),2);
        }

        // company pay
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractIncome, $companyPay, 'Contract Pay: '. $contractId, $pirep, 'credit');
        // pilot pay
        if ($rental || $privatePlane) {
            $pilotPay = (FinancialConsts::PrivatePilotPay / 100) * $companyPay;
        } else {
            $pilotPay = (FinancialConsts::PilotPay / 100) * $companyPay;
        }
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractExpenditure, $pilotPay, 'Pilot Pay: '. $contractId, $pirep);
        return $pilotPay;
    }
}
