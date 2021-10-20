<?php

namespace App\Models\Enums;

class PointsType
{
    public const COMPLETED_FLIGHT = 5;
    public const FIFTY_MILES = 2;
    public const HOME_HUB = 5;
    public const FLAPS_TAKEOFF = 1;
    public const FLAPS_LANDING = 1;
    public const EXCEED_ALT_SPEED = -5;
    public const OVERSPEED_EVENT = -2;
    public const TIME_COMPRESSION_PERC_DEDUCTION = 15;
    public const LANDING_RATE_BELOW_ZERO = -2;
    public const LANDING_RATE_0_2 = -1;
    public const LANDING_RATE_3_39 = 1;
    public const LANDING_RATE_40_59 = 3;
    public const LANDING_RATE_PERFECT_60 = 50;
    public const LANDING_RATE_61_180 = 5;
    public const LANDING_RATE_181_400 = 1;
    public const LANDING_RATE_OVER_400 = -2;

    public const COMPLETED_FLIGHT_LABEL = 'Flight completed';
    public const FIFTY_MILES_LABEL = 'Per 50nm';
    public const HOME_HUB_LABEL = 'Returned aircraft home';
    public const FLAPS_TAKEOFF_LABEL = 'Takeoff flaps';
    public const FLAPS_LANDING_LABEL = 'Landing flaps';
    public const EXCEED_ALT_SPEED_LABEL = 'Exceeded 250 kts below 10;000 ft';
    public const OVERSPEED_EVENT_LABEL = 'Overspeed';
    public const TIME_COMPRESSION_PERC_DEDUCTION_LABEL = 'Time compression deduction';
    public const LANDING_RATE_BELOW_ZERO_LABEL = 'Landing rate under 0fpm';
    public const LANDING_RATE_0_2_LABEL = 'Landing rate 0fpm to 2fpm';
    public const LANDING_RATE_3_39_LABEL = 'Landing rate 3fpm to 39fpm';
    public const LANDING_RATE_40_59_LABEL = 'Landing rate 40fpm to 59fpm';
    public const LANDING_RATE_PERFECT_60_LABEL = 'Landing rate 60fpm';
    public const LANDING_RATE_61_180_LABEL = 'Landing rate 60fpm to 180fpm';
    public const LANDING_RATE_181_400_LABEL = 'Landing rate 181fpm to 500fpm';
    public const LANDING_RATE_OVER_400_LABEL = 'Landing rate over 500fpm';
}
