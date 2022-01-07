<?php

namespace App\Services\Pireps;

use App\Models\Aircraft;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\PointsType;
use App\Models\Enums\TransactionTypes;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;

class CalculatePirepPoints
{
    protected StorePirepPointsEntry $storePirepPointsEntry;
    protected AddUserTransaction $addUserTransaction;
    protected AddAirlineTransaction $addAirlineTransaction;
    protected CalculateLandingRatePoints $calculateLandingRatePoints;

    public function __construct(
        StorePirepPointsEntry $storePirepPointsEntry,
        AddUserTransaction $addUserTransaction,
        AddAirlineTransaction $addAirlineTransaction,
        CalculateLandingRatePoints $calculateLandingRatePoints
    )
    {
        $this->storePirepPointsEntry = $storePirepPointsEntry;
        $this->addUserTransaction = $addUserTransaction;
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->calculateLandingRatePoints = $calculateLandingRatePoints;
    }

    public function execute($pirep)
    {
        // completed flight
        $this->storePirepPointsEntry->execute($pirep->id, PointsType::COMPLETED_FLIGHT_LABEL, PointsType::COMPLETED_FLIGHT);

        // hub
        if (!$pirep->is_rental) {
            $aircraft = Aircraft::find($pirep->aircraft_id);
            if ($pirep->destination_airport_id == $aircraft->hub_id && $aircraft->owner_id == 0) {
                $this->storePirepPointsEntry->execute($pirep->id, PointsType::HOME_HUB_LABEL, PointsType::HOME_HUB);
                $this->addUserTransaction->execute($pirep->user_id, TransactionTypes::Bonus, FinancialConsts::HubBonus,
                    $pirep->id);
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractExpenditure,
                    FinancialConsts::HubBonus, 'Returned aircraft home', $pirep->id);
            }
        }


        // time
//        $hours = floor($pirep->flight_time / 60);
//        $this->addPointsEntry($pirep->id, PointsType::ONE_HOUR_LABEL, PointsType::ONE_HOUR * $hours);

        // distance
        $distance = floor($pirep->distance / 50);
        $this->storePirepPointsEntry->execute($pirep->id, PointsType::FIFTY_MILES_LABEL, PointsType::FIFTY_MILES * $distance);

        // TODO: flaps

        // TODO: overspeed

        // landing rate
        $landing_rate = $this->calculateLandingRatePoints->execute($pirep->landing_rate);
        if ($landing_rate['points'] > 0) {
            $this->storePirepPointsEntry->execute($pirep->id, $landing_rate['type'], $landing_rate['points']);
        }

        // TODO: exceed 250 under 10,000ft

        // TODO: time compression penalty
    }
}
