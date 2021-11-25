<?php

namespace App\Services\Pireps;

use App\Models\Enums\PointsType;

class CalculateLandingRatePoints
{
    public function execute($landingRate): array
    {
        $points = 0.00;
        $type = '';
        switch (true) {
            case $landingRate < 0.00:
                $points = PointsType::LANDING_RATE_BELOW_ZERO;
                $type = PointsType::LANDING_RATE_BELOW_ZERO_LABEL;
                break;
            case ($landingRate >= 0.00 && $landingRate <= 2.99):
                $points = PointsType::LANDING_RATE_0_2;
                $type = PointsType::LANDING_RATE_0_2_LABEL;
                break;
            case ($landingRate >= 3.00 && $landingRate < 40.00):
                $points = PointsType::LANDING_RATE_3_39;
                $type = PointsType::LANDING_RATE_3_39_LABEL;
                break;
            case ($landingRate >= 40.00 && $landingRate < 60.00):
                $points = PointsType::LANDING_RATE_40_59;
                $type = PointsType::LANDING_RATE_40_59_LABEL;
                break;
            case ($landingRate >= 60.00 && $landingRate < 61.00):
                $points = PointsType::LANDING_RATE_PERFECT_60;
                $type = PointsType::LANDING_RATE_PERFECT_60_LABEL;
                break;
            case ($landingRate >= 61.00 && $landingRate < 180.00):
                $points = PointsType::LANDING_RATE_61_180;
                $type = PointsType::LANDING_RATE_61_180_LABEL;
                break;
            case ($landingRate >= 180.00 && $landingRate < 400.00):
                $points = PointsType::LANDING_RATE_181_400;
                $type = PointsType::LANDING_RATE_181_400_LABEL;
                break;
            case $landingRate > 400.00:
                $points = PointsType::LANDING_RATE_OVER_400;
                $type = PointsType::LANDING_RATE_OVER_400_LABEL;
                break;
        }

        return ['points' => $points, 'type' => $type];
    }
}
