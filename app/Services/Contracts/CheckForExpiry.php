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
    protected AddAirlineTransaction $addAirlineTransaction;
    protected AddUserTransaction $addUserTransaction;
    protected CloseContract $closeContract;
    public function __construct(AddAirlineTransaction $addAirlineTransaction, AddUserTransaction $addUserTransaction, CloseContract $closeContract)
    {
        $this->addUserTransaction = $addUserTransaction;
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->closeContract = $closeContract;
    }

    public function execute()
    {
        $contracts = Contract::with('cargo')
            ->where('expires_at', '<', Carbon::now())
            ->get();

        foreach ($contracts as $contract) {
            $inProgress = 0;
            // check for completed cargo
            foreach ($contract->cargo as $cargo) {
                if ($cargo->is_completed) {
                    // add airline pay
                    $companyPay = $cargo->contract_value;
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractIncome, $companyPay, 'Contract Pay: '. $contract->id, $cargo->completed_pirep, 'credit');
                    // add pilot pay
                    $pilotPay = (FinancialConsts::PrivatePilotPay / 100) * $companyPay;
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractExpenditure, $pilotPay, 'Pilot Pay: '. $contract->id, $cargo->completed_pirep);
                    $this->addUserTransaction->execute($cargo->user_id, TransactionTypes::FlightPay, $pilotPay, $cargo->completed_pirep);
                }

                if ($cargo->active_pirep != null) {
                    $inProgress = 1;
                }
            }
            // close contract
            if (!$inProgress) {
                $this->closeContract->execute($contract->id);
            }
        }
    }
}
