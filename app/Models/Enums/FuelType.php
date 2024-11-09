<?php

namespace App\Models\Enums;

class FuelType
{
    public const AVGAS = 1;
    public const JET = 2;

    public static $labels = [
        self::AVGAS => '100LL',
        self::JET => 'Jet',
    ];
}
