<?php

namespace App\Services\Finance;

use App\Models\Aircraft;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\TransactionTypes;
use App\Models\PirepCargo;
use App\Services\Rentals\ChargeRentalFee;

class ProcessPirepFinancials
{
    protected CalcLandingFee $calcLandingFee;
    protected CalcFuelUsedFee $calcFuelUsedFee;
    protected CalcCargoHandlingFee $calcCargoHandlingFee;
    protected CalcContractPay $calcContractPay;
    protected AddUserTransaction $addUserTransaction;
    protected ChargeRentalFee $chargeRentalFee;

    public function __construct(
        CalcLandingFee $calcLandingFee,
        CalcFuelUsedFee $calcFuelUsedFee,
        CalcCargoHandlingFee $calcCargoHandlingFee,
        CalcContractPay $calcContractPay,
        AddUserTransaction $addUserTransaction,
        ChargeRentalFee $chargeRentalFee
    )
    {
        $this->calcLandingFee = $calcLandingFee;
        $this->calcFuelUsedFee = $calcFuelUsedFee;
        $this->calcCargoHandlingFee = $calcCargoHandlingFee;
        $this->calcContractPay = $calcContractPay;
        $this->addUserTransaction = $addUserTransaction;
        $this->chargeRentalFee = $chargeRentalFee;
    }

    public function execute($pirep)
    {
        if (!$pirep->is_rental) {
            $aircraft = Aircraft::find($pirep->aircraft_id);
        }

        $this->calcLandingFee->execute($pirep);
        $this->calcFuelUsedFee->execute($pirep);

        if (!$pirep->is_empty) {
            $this->calcCargoHandlingFee->execute($pirep);
            $cargo = PirepCargo::where('pirep_id', $pirep->id)->get();
            foreach ($cargo as $c) {
                $contractCargo = ContractCargo::find($c->contract_cargo_id);
                $contract = Contract::where('id', $contractCargo->contract_id)
                    ->where('is_paid', false)
                    ->where('is_completed', true)
                    ->first();

                if (isset($contract)) {
                    if (!$pirep->is_rental) {
                        $privatePlane = !($aircraft->owner_id == 0);
                    } else {
                        $privatePlane = false;
                    }

                    $pp = $this->calcContractPay->execute($contract->id, $pirep->id, $pirep->is_rental, $privatePlane);
                    $this->addUserTransaction->execute($pirep->user_id, TransactionTypes::FlightPay, $pp, $pirep->id);
                    $contract->is_paid = true;
                    $contract->save();
                }
            }
        }

        if ($pirep->is_rental) {
            // charge rental fee
            $this->chargeRentalFee->execute($pirep->id);
        }
    }
}
