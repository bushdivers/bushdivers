<?php

namespace App\Models\Enums;

class AircraftState
{
    public const AVAILABLE = 1;
    public const ON_GROUND = 2;
    public const FLYING = 3;

    public static $labels = [
        self::AVAILABLE => 'Available',
        self::ON_GROUND => 'On Ground',
        self::FLYING => 'Flying'
    ];
}
