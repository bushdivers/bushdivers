<?php

namespace App\Models\Enums;

class PointsType
{
    public const COMPLETED_FLIGHT = 5;
    public const ONE_HOUR = 1;
    public const FIFTY_MILES = 1;
    public const HOME_HUB = 5;
    public const FLAPS_TAKEOFF = 1;
    public const FLAPS_LANDING = 1;
    public const EXCEED_ALT_SPEED = -5;
    public const OVERSPEED_EVENT = -2;
    public const TIME_COMPRESSION_PERC_DEDUCTION = 15;
    public const LANDING_RATE_M600_M500 = -3;
    public const LANDING_RATE_M499_M300 = -2;
    public const LANDING_RATE_M299_M200 = 2;
    public const LANDING_RATE_M199_M151 = 5;
    public const LANDING_RATE_PERFECT = 100;
    public const LANDING_RATE_M149_M100 = 5;
    public const LANDING_RATE_M99_300 = 2;
    public const LANDING_RATE_301_500 = -2;
    public const LANDING_RATE_501_800 = -3;

    public const COMPLETED_FLIGHT_LABEL = 'Flight completed';
    public const ONE_HOUR_LABEL = 'Per hour of flight';
    public const FIFTY_MILES_LABEL = 'Per 50nm';
    public const HOME_HUB_LABEL = 'Home hub';
    public const FLAPS_TAKEOFF_LABEL = 'Takeoff flaps';
    public const FLAPS_LANDING_LABEL = 'Landing flaps';
    public const EXCEED_ALT_SPEED_LABEL = 'Exceeded 250 kts below 10;000 ft';
    public const OVERSPEED_EVENT_LABEL = 'Overspeed';
    public const TIME_COMPRESSION_PERC_DEDUCTION_LABEL = 'Time compression deduction';
    public const LANDING_RATE_M600_M500_LABEL = 'Landing rate -600fpm to -500fpm';
    public const LANDING_RATE_M499_M300_LABEL = 'Landing rate -499fpm to -300fpm';
    public const LANDING_RATE_M299_M200_LABEL = 'Landing rate -299fpm to -200fpm';
    public const LANDING_RATE_M199_M151_LABEL = 'Landing rate -199fpm to -151fpm';
    public const LANDING_RATE_PERFECT_LABEL = 'Landing rate -150fpm';
    public const LANDING_RATE_M149_M100_LABEL = 'Landing rate -149fpm to -100fpm';
    public const LANDING_RATE_M99_300_LABEL = 'Landing rate -99fpm to 300fpm';
    public const LANDING_RATE_301_500_LABEL = 'Landing rate 301fpm to 500fpm';
    public const LANDING_RATE_501_800_LABEL = 'Landing rate 501fpm to 800fpm';
}
