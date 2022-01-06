<?php

namespace App\Services\Finance;

use App\Models\Aircraft;
use App\Models\AirlineFees;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;

class CalcAircraftFees
{
    protected AddAirlineTransaction $addAirlineTransaction;
    protected AddUserTransaction $addUserTransaction;

    public function __construct(
        AddAirlineTransaction $addAirlineTransaction,
        AddUserTransaction $addUserTransaction
    )
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->addUserTransaction = $addUserTransaction;
    }

    public function execute()
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
            $aircraft = Aircraft::with('fleet')
                ->where('status', AircraftStatus::ACTIVE)
                ->where('fleet_id', $f->id)
                ->get();
            foreach ($aircraft as $a) {
                if ($a->owner_id == 0) {
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftRentalFee, $smallRental->fee_amount, 'Rental: '.$a->registration);
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftStorageFees, $smallParking->fee_amount, 'Parking: '.$a->registration);
                } else {
                    $this->addUserTransaction->execute($a->owner_id, TransactionTypes::MonthlyOwnership, $smallRental->fee_amount);
                }
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
            $aircraft = Aircraft::with('fleet')
                ->where('fleet_id', $f->id)
                ->where('status', AircraftStatus::ACTIVE)
                ->get();
            foreach ($aircraft as $a) {
                if ($a->owner_id == 0) {
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftRentalFee, $mediumRental->fee_amount, 'Rental: '.$a->registration);
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftStorageFees, $mediumParking->fee_amount, 'Parking: '.$a->registration);
                } else {
                    $this->addUserTransaction->execute($a->owner_id, TransactionTypes::MonthlyOwnership, $mediumRental->fee_amount);
                }
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
            $aircraft = Aircraft::with('fleet')
                ->where('fleet_id', $f->id)
                ->where('status', AircraftStatus::ACTIVE)
                ->get();
            foreach ($aircraft as $a) {
                if ($a->owner_id == 0) {
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftRentalFee, $largeRental->fee_amount, 'Rental: '.$a->registration);
                    $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftStorageFees, $largeParking->fee_amount, 'Parking: '.$a->registration);
                } else {
                    $this->addUserTransaction->execute($a->owner_id, TransactionTypes::MonthlyOwnership, $mediumRental->fee_amount);
                }
            }

        }
    }
}
