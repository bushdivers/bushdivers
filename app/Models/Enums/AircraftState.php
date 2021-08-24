<?php

namespace App\Models\Enums;

class AircraftState
{
    public const AVAILABLE = 1;
    public const BOOKED = 2;
    public const IN_USE = 3;

    public static $labels = [
        self::AVAILABLE => 'Available',
        self::BOOKED => 'Booked',
        self::IN_USE => 'In Use'
    ];
}
