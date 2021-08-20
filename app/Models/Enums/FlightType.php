<?php

namespace App\Models\Enums;

class FlightType
{
    public const SCHEDULED = 1;
    public const CHARTER = 2;
    public const TOUR = 3;

    public static $labels = [
        self::SCHEDULED => 'Scheduled',
        self::CHARTER => 'Custom',
        self::TOUR => 'Tour'
    ];
}
