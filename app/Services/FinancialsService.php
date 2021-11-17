<?php

namespace App\Services;

use App\Models\AccountLedger;
use App\Models\Aircraft;
use App\Models\AirlineFees;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\ContractType;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Models\PirepCargo;
use App\Services\Rentals\ChargeRentalFee;

class FinancialsService
{
    protected float $personWeight = 80.00;
    protected ChargeRentalFee $chargeRentalFee;

    public function __construct(ChargeRentalFee $chargeRentalFee)
    {
        $this->chargeRentalFee = $chargeRentalFee;
    }

    public function calcMonthlyFees()
    {
        $this->calcHubFees();
        $this->calcAircraftFees();
    }

    public function calcAircraftFees()
    {
        // small
        $smallFleet = Fleet::where('size', 'S')->get();
        $smallRental = AirlineFees::where('fee_type', AirlineTransactionTypes::AircraftRentalFee)
            ->where('fee_name', 'Aircraft Ownership - Small')
            ->first();
        $smallParking = AirlineFees::where('fee_type', AirlineTransactionTypes::AircraftStorageFees)
            ->where('fee_name', 'Aircraft Parking - Small')
            ->first();
        foreach ($smallFleet as $f) {
            $aircraft = Aircraft::with('fleet')->where('fleet_id', $f->id)->get();
            foreach ($aircraft as $a) {
                $this->addTransaction(AirlineTransactionTypes::AircraftRentalFee, $smallRental->fee_amount, 'Rental: '.$a->registration);
                $this->addTransaction(AirlineTransactionTypes::AircraftStorageFees, $smallParking->fee_amount, 'Parking: '.$a->registration);
            }

        }
        // medium
        $mediumFleet = Fleet::where('size', 'M')->get();
        $mediumRental = AirlineFees::where('fee_type', AirlineTransactionTypes::AircraftRentalFee)
            ->where('fee_name', 'Aircraft Ownership - Medium')
            ->first();
        $mediumParking = AirlineFees::where('fee_type', AirlineTransactionTypes::AircraftStorageFees)
            ->where('fee_name', 'Aircraft Parking - Medium')
            ->first();
        foreach ($mediumFleet as $f) {
            $aircraft = Aircraft::with('fleet')->where('fleet_id', $f->id)->get();
            foreach ($aircraft as $a) {
                $this->addTransaction(AirlineTransactionTypes::AircraftRentalFee, $mediumRental->fee_amount, 'Rental: '.$a->registration);
                $this->addTransaction(AirlineTransactionTypes::AircraftStorageFees, $mediumParking->fee_amount, 'Parking: '.$a->registration);
            }
        }
        // large
        $largeFleet = Fleet::where('size', 'L')->get();
        $largeRental = AirlineFees::where('fee_type', AirlineTransactionTypes::AircraftRentalFee)
            ->where('fee_name', 'Aircraft Ownership - Large')
            ->first();
        $largeParking = AirlineFees::where('fee_type', AirlineTransactionTypes::AircraftStorageFees)
            ->where('fee_name', 'Aircraft Parking - Large')
            ->first();
        foreach ($largeFleet as $f) {
            $aircraft = Aircraft::with('fleet')->where('fleet_id', $f->id)->get();
            foreach ($aircraft as $a) {
                $this->addTransaction(AirlineTransactionTypes::AircraftRentalFee, $largeRental->fee_amount, 'Rental: '.$a->registration);
                $this->addTransaction(AirlineTransactionTypes::AircraftStorageFees, $largeParking->fee_amount, 'Parking: '.$a->registration);
            }

        }
    }

    public function calcHubFees()
    {
        $fee = AirlineFees::where('fee_type', AirlineTransactionTypes::HubRentalFees)->first();
        $hubs = Airport::where('is_hub', true)->get();

        foreach ($hubs as $hub) {
            $this->addTransaction(AirlineTransactionTypes::HubRentalFees, $fee->fee_amount, 'Monthly Hub Rental - '. $hub->identifier);
        }
    }

    public function calcFuelUsedFee($pirep)
    {
        $userService = new UserService();
        $aircraft = Aircraft::with('fleet')->find($pirep->aircraft_id);
        $fuelType = $aircraft->fleet->fuel_type == 1 ? 'Avgas' : 'Jet Fuel';
        $fuelCost = AirlineFees::where('fee_name', $fuelType)->first();

        $fuelUsedCost = $fuelCost->fee_amount * $pirep->fuel_used;
        // TODO: if negative, 0 fuel fee for company, and charge pilot for fuel
        if ($fuelUsedCost < 0) {
            if (!$aircraft->is_rental) {
                $this->addTransaction(AirlineTransactionTypes::FuelFees, +$fuelUsedCost, 'Fuel Cost', $pirep->id);
                $this->addTransaction(AirlineTransactionTypes::FuelFees, +$fuelUsedCost, 'Fuel Cost Paid by Pilot', $pirep->id, 'credit');

                // add line to pilot transactions
                $userService->addUserAccountEntry($pirep->user_id, TransactionTypes::FuelPenalty, $fuelUsedCost, $pirep->id);
            } else {
                // add line to pilot transactions
                $userService->addUserAccountEntry($pirep->user_id, TransactionTypes::FlightFeesFuel, $fuelUsedCost, $pirep->id);
            }

        } else {
            if (!$aircraft->is_rental) {
                $this->addTransaction(AirlineTransactionTypes::FuelFees, $fuelUsedCost, 'Fuel Cost', $pirep->id);
            } else {
                $userService->addUserAccountEntry($pirep->user_id, TransactionTypes::FlightFeesFuel, $fuelUsedCost, $pirep->id);
            }
        }
    }

    public function calcLandingFee($pirep)
    {
        $userService = new UserService();
        $aircraft = Aircraft::with('fleet')->find($pirep->aircraft_id);
        $feeType = null;
        switch ($aircraft) {
            case $aircraft->fleet->size == 'S':
                $feeType = 'Landing Fees - Small';
                break;
            case $aircraft->fleet->size == 'M':
                $feeType = 'Landing Fees - Medium';
                break;
            case $aircraft->fleet->size == 'L':
                $feeType = 'Landing Fees - Large';
                break;
        }

        $fee = AirlineFees::where('fee_name', $feeType)->first();
        if (!$aircraft->is_rental) {
            $this->addTransaction(AirlineTransactionTypes::LandingFees, $fee->fee_amount, $feeType, $pirep->id);
        } else {
            $userService->addUserAccountEntry($pirep->user_id, TransactionTypes::FlightFeesLanding, $fee->fee_amount, $pirep->id);
        }
    }

    public function calcCargoHandling($pirep)
    {
        $userService = new UserService();
        $aircraft = Aircraft::with('fleet')->find($pirep->aircraft_id);
        $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
        $fee = AirlineFees::where('fee_type', AirlineTransactionTypes::GroundHandlingFees)->first();
        $weight = 0;
        foreach ($pc as $c) {
            $cargo = ContractCargo::find($c->contract_cargo_id);
            if ($cargo->contract_type_id == ContractType::Cargo) {
                $weight += $cargo->cargo_qty;
            } else if ($cargo->contract_type_id == ContractType::Passenger) {
                $weight = $cargo->cargo_qty * $this->personWeight;
            }
        }
        $total = $weight * $fee->fee_amount;
        if (!$aircraft->is_rental) {
            $this->addTransaction(AirlineTransactionTypes::GroundHandlingFees, $total, 'Cargo Handling', $pirep->id);
        } else {
            $userService->addUserAccountEntry($pirep->user_id, TransactionTypes::FlightFeesGround, $total, $pirep->id);
        }

    }

    public function calcContractPay($contractId, $pirep = null, $rental = false): float
    {
        $contract = Contract::find($contractId);
        // company pay
        $companyPay = $contract->contract_value;
        $this->addTransaction(AirlineTransactionTypes::ContractIncome, $companyPay, 'Contract Pay: '. $contractId, $pirep, 'credit');
        // pilot pay
        if ($rental) {
            $pilotPay = (80 / 100) * $contract->contract_value;
        } else {
            $pilotPay = (FinancialConsts::PilotPay / 100) * $contract->contract_value;
        }
        $this->addTransaction(AirlineTransactionTypes::ContractExpenditure, $pilotPay, 'Pilot Pay: '. $contractId, $pirep);
        return $pilotPay;
    }

    public function addTransaction(int $type, float $total, string $memo = null, $pirepId = null, $method = 'debit')
    {
        $transactionTotal = 0;
        if ($method == 'debit') {
            $transactionTotal = -$total;
        } else if ($method == 'credit') {
            $transactionTotal = $total;
        }

        $ledger = new AccountLedger();
        $ledger->transaction_type = $type;
        $ledger->total = $transactionTotal;
        $ledger->memo = $memo;
        $ledger->pirep_id = $pirepId;
        $ledger->save();
    }

    public function processPirepFinancials($pirep)
    {
        $userService = new UserService();
        $aircraft = Aircraft::find($pirep->aircraft_id);
        $this->calcLandingFee($pirep);
        $this->calcFuelUsedFee($pirep);

        if (!$pirep->is_empty) {
            $this->calcCargoHandling($pirep);
            $cargo = PirepCargo::where('pirep_id', $pirep->id)->get();
            foreach ($cargo as $c) {
                $contractCargo = ContractCargo::find($c->contract_cargo_id);
                $contract = Contract::where('id', $contractCargo->contract_id)
                    ->where('is_paid', false)
                    ->where('is_completed', true)
                    ->first();

                if (isset($contract)) {
                    $pp = $this->calcContractPay($contract->id, $pirep->id, $aircraft->is_rental);
                    $userService->addUserAccountEntry($pirep->user_id, TransactionTypes::FlightPay, $pp, $pirep->id);
//                    $userService->updateUserAccountBalance($pirep->user_id, $pp);
                    $contract->is_paid = true;
                    $contract->save();
                }
            }
        }

        if ($aircraft->is_rental) {
            // charge rental fee
            $this->chargeRentalFee->execute($pirep->id);
        }
    }
}
