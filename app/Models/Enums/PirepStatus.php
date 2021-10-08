<?php

namespace App\Models\Enums;

class PirepStatus
{
    public const BOARDING = 1;
    public const DEPARTED = 2;
    public const CRUISE = 3;
    public const APPROACH = 4;
    public const ARRIVED = 5;

    public static $labels = [
        self::BOARDING => 'Boarding',
        self::DEPARTED => 'Departed',
        self::CRUISE => 'Cruise',
        self::APPROACH => 'Approach',
        self::ARRIVED => 'Arrived'
    ];
}
