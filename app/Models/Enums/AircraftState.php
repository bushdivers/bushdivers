<?php

namespace App\Models\Enums;

class AircraftState
{
    public const AVAILABLE = 0;
    public const ON_GROUND = 1;
    public const FLYING = 2;

    public static $labels = [
        self::AVAILABLE => 'Available',
        self::ON_GROUND => 'On Ground',
        self::FLYING => 'Flying'
    ];
}
