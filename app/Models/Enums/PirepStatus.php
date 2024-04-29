<?php

namespace App\Models\Enums;

class PirepStatus
{
    public const PREFLIGHT = 0;
    public const BOARDING = 1;
    public const DEPARTED = 2;
    public const CRUISE = 3;
    public const LANDED = 4;
    public const ARRIVED = 5;

    public static $labels = [
        self::PREFLIGHT => 'Preflight',
        self::BOARDING => 'Boarding',
        self::DEPARTED => 'Departed',
        self::CRUISE => 'Cruise',
        self::LANDED => 'Landed',
        self::ARRIVED => 'Arrived'
    ];
}
