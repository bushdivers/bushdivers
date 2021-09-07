<?php

namespace App\Services;

use App\Models\Enums\PointsType;
use App\Models\Flight;
use App\Models\Pirep;
use App\Models\Point;
use App\Models\Rank;
use App\Models\User;

class PirepService
{
    public function calculatePoints($pirep)
    {
        // completed flight
        $this->addPointsEntry($pirep->id, PointsType::COMPLETED_FLIGHT_LABEL, PointsType::COMPLETED_FLIGHT);

        // hub
        $flight = Flight::find($pirep->flight_id);
        $user = User::find($pirep->user_id);
        if ($flight->dep_airport_id == $user->hub_id || $flight->arr_airport_id == $user->hub_id) {
            $this->addPointsEntry($pirep->id, PointsType::HOME_HUB_LABEL, PointsType::HOME_HUB);
        }

        // time
        $hours = floor($pirep->flight_time / 60);
        $this->addPointsEntry($pirep->id, PointsType::ONE_HOUR_LABEL, PointsType::ONE_HOUR * $hours);

        // distance
        $distance = floor($pirep->distance / 50);
        $this->addPointsEntry($pirep->id, PointsType::FIFTY_MILES_LABEL, PointsType::FIFTY_MILES * $distance);

        // TODO: flaps

        // TODO: overspeed

        // landing rate
        $landing_rate = $this->calculateLandingRatePoints($pirep->landing_rate);
        if ($landing_rate['points'] > 0) {
            $this->addPointsEntry($pirep->id, $landing_rate['type'], $landing_rate['points']);
        }

        // TODO: exceed 250 under 10,000ft

        // TODO: time compression penalty
    }

    public function calculatePilotPay($pirep)
    {
        $user = User::find($pirep->user_id);
        $rank = Rank::find($user->rank_id);

        // duration in hours decimal
        $duration = $pirep->flight_time / 60;
        $pay = $rank->pilot_pay * $duration;

        $user->account_balance = $user->account_balance + $pay;
        $user->save();
    }

    public function calculateLandingRatePoints($landingRate): array
    {
        $points = 0;
        $type = '';
        switch (true) {
            case in_array($landingRate, range(-500,-600)):
                $points = PointsType::LANDING_RATE_M600_M500;
                $type = PointsType::LANDING_RATE_M600_M500_LABEL;
                break;
            case in_array($landingRate, range(-300,-499)):
                $points = PointsType::LANDING_RATE_M499_M300;
                $type = PointsType::LANDING_RATE_M499_M300_LABEL;
                break;
            case in_array($landingRate, range(-200,-299)):
                $points = PointsType::LANDING_RATE_M299_M200;
                $type = PointsType::LANDING_RATE_M299_M200_LABEL;
                break;
            case in_array($landingRate, range(-151,-199)):
                $points = PointsType::LANDING_RATE_M199_M151;
                $type = PointsType::LANDING_RATE_M199_M151_LABEL;
                break;
            case $landingRate == 150:
                $points = PointsType::LANDING_RATE_PERFECT;
                $type = PointsType::LANDING_RATE_PERFECT_LABEL;
                break;
            case in_array($landingRate, range(-100,-149)):
                $points = PointsType::LANDING_RATE_M149_M100;
                $type = PointsType::LANDING_RATE_M149_M100_LABEL;
                break;
            case in_array($landingRate, range(-99,300)):
                $points = PointsType::LANDING_RATE_M99_300;
                $type = PointsType::LANDING_RATE_M99_300_LABEL;
                break;
            case in_array($landingRate, range(301,500)):
                $points = PointsType::LANDING_RATE_301_500;
                $type = PointsType::LANDING_RATE_301_500_LABEL;
                break;
            case in_array($landingRate, range(501,800)):
                $points = PointsType::LANDING_RATE_501_800;
                $type = PointsType::LANDING_RATE_501_800_LABEL;
                break;
        }

        return ['points' => $points, 'type' => $type];
    }

    public function updatePirepTotalScore($pirep)
    {
        $points = Point::where('pirep_id', $pirep->id)->sum('points');
        $p = Pirep::find($pirep->id);
        $p->score = $points;
        $p->save();
    }

    protected function addPointsEntry(string $pirep_id, string $type, int $points)
    {
        $entry = new Point();
        $entry->pirep_id = $pirep_id;
        $entry->type_name = $type;
        $entry->points = $points;
        $entry->save();
    }
}
