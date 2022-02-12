<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\Enums\FinancialConsts;
use Carbon\Carbon;

class ExpiryContractCheck
{
    public function execute(string $time)
    {
        switch ($time) {
            case $time == FinancialConsts::ContractExpiryDaysStr:
                $multiplier = FinancialConsts::ContractExpiryDays;
                $contracts = Contract::whereBetween('expires_at', [Carbon::now()->addHours(24), Carbon::now()->addHours(48)])
                    ->where('days_updated', false)
                    ->where('is_available', true)
                    ->get();
                $this->updateContracts($multiplier, $contracts, 'days_updated');
                break;
            case $time == FinancialConsts::ContractExpiryDayStr:
                $multiplier = FinancialConsts::ContractExpiryDay;
                $contracts = Contract::whereBetween('expires_at', [Carbon::now()->addMinutes(720), Carbon::now()->addMinutes(1440)])
                    ->where('day_updated', false)
                    ->where('is_available', true)
                    ->get();
                $this->updateContracts($multiplier, $contracts, 'day_updated');
                break;
            case $time == FinancialConsts::ContractExpiryHalfStr:
                $multiplier = FinancialConsts::ContractExpiryHalf;
                $contracts = Contract::whereBetween('expires_at', [Carbon::now()->addMinutes(120), Carbon::now()->addMinutes(720)])
                    ->where('half_updated', false)
                    ->where('is_available', true)
                    ->get();
                $this->updateContracts($multiplier, $contracts, 'half_updated');
                break;
            case $time == FinancialConsts::ContractExpiryHoursStr:
                $multiplier = FinancialConsts::ContractExpiryHours;
                $contracts = Contract::whereBetween('expires_at', [Carbon::now()->addMinutes(60), Carbon::now()->addMinutes(120)])
                    ->where('hours_updated', false)
                    ->where('is_available', true)
                    ->get();
                $this->updateContracts($multiplier, $contracts, 'hours_updated');
                break;
            case $time == FinancialConsts::ContractExpiryHourStr:
                $multiplier = FinancialConsts::ContractExpiryHour;
                $contracts = Contract::whereBetween('expires_at', [Carbon::now()->addMinutes(10), Carbon::now()->addMinutes(60)])
                    ->where('hour_updated', false)
                    ->where('is_available', true)
                    ->get();
                $this->updateContracts($multiplier, $contracts, 'hour_updated');
                break;
            case $time == FinancialConsts::ContractExpiryMinsStr:
                $multiplier = FinancialConsts::ContractExpiryMins;
                $contracts = Contract::whereBetween('expires_at', [Carbon::now(), Carbon::now()->addMinutes(10)])
                    ->where('mins_updated', false)
                    ->where('is_available', true)
                    ->get();
                $this->updateContracts($multiplier, $contracts, 'mins_updated');
                break;
        }
    }

    protected function updateContracts($multiplier, $contracts, $field)
    {
        foreach ($contracts as $contract) {
            $contract->update([
                'contract_value' => $contract->contract_value * $multiplier,
                $field => true
            ]);

            //$contract->save();
        }
    }
}
