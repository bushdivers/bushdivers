<?php

namespace App\Models\Enums;

class AircraftStatus
{
    public const ACTIVE = 0;
    public const MAINTENANCE = 1;
    public const SCRAPPED = 2;

    public static $labels = [
        self::ACTIVE => 'Active',
        self::MAINTENANCE => 'Maintenance',
        self::SCRAPPED => 'Scrapped'
    ];
}
