<?php

namespace App\Models\Enums;

class AircraftStatus
{
    public const ACTIVE = 1;
    public const MAINTENANCE = 2;
    public const SCRAPPED = 3;

    public static $labels = [
        self::ACTIVE => 'Active',
        self::MAINTENANCE => 'Maintenance',
        self::SCRAPPED => 'Scrapped'
    ];
}
