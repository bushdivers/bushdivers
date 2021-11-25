<?php

namespace App\Services\Finance;

use App\Models\Aircraft;
use App\Models\AirlineFees;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Fleet;

class CalcAircraftFees
{
    protected AddAirlineTransaction $addAirlineTransaction;

    public function __construct(AddAirlineTransaction $addAirlineTransaction)
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
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
            $aircraft = Aircraft::with('fleet')->where('fleet_id', $f->id)->get();
            foreach ($aircraft as $a) {
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftRentalFee, $smallRental->fee_amount, 'Rental: '.$a->registration);
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftStorageFees, $smallParking->fee_amount, 'Parking: '.$a->registration);
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
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftRentalFee, $mediumRental->fee_amount, 'Rental: '.$a->registration);
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftStorageFees, $mediumParking->fee_amount, 'Parking: '.$a->registration);
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
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftRentalFee, $largeRental->fee_amount, 'Rental: '.$a->registration);
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::AircraftStorageFees, $largeParking->fee_amount, 'Parking: '.$a->registration);
            }

        }
    }
}
