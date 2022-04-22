<?php

namespace App\Services\Finance;

use App\Models\Aircraft;
use App\Models\AirlineFees;
use App\Models\Airport;
use App\Models\ContractCargo;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\ContractType;
use App\Models\Enums\TransactionTypes;
use App\Models\Enums\WeightConsts;
use App\Models\PirepCargo;
use App\Models\Rental;

class CalcCargoHandlingFee
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

    public function execute($pirep)
    {
        $airport = Airport::where('identifier', $pirep->destination_airport_id)->first();
        if ($airport->size == 0) return;
        if ($pirep->is_rental) {
            $aircraft = Rental::with('fleet')->find($pirep->aircraft_id);
        } else {
            $aircraft = Aircraft::with('fleet')->find($pirep->aircraft_id);
        }

        $pc = PirepCargo::where('pirep_id', $pirep->id)->get();
        $fee = AirlineFees::where('fee_type', AirlineTransactionTypes::GroundHandlingFees)->first();
        $weight = 0;
        foreach ($pc as $c) {
            $cargo = ContractCargo::find($c->contract_cargo_id);
            if ($cargo->cargo_type_id == ContractType::Cargo) {
                $weight += $cargo->cargo_qty;
            } else if ($cargo->cargo_type_id == ContractType::Passenger) {
                $weight = $cargo->cargo_qty * WeightConsts::PERSON_WEIGHT;
            }
        }
        $total = $weight * $fee->fee_amount;
        if ($pirep->is_rental) {
            $this->addUserTransaction->execute($pirep->user_id, TransactionTypes::FlightFeesGround, -$total, $pirep->id);
        } elseif ($aircraft->owner_id > 0) {
            $this->addUserTransaction->execute($pirep->user_id, TransactionTypes::FlightFeesGround, -$total, $pirep->id);
        } else {
            $this->addAirlineTransaction->execute(AirlineTransactionTypes::GroundHandlingFees, $total, 'Cargo Handling', $pirep->id);
        }
    }
}
