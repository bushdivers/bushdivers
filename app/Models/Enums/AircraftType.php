<?php

namespace App\Models\Enums;

enum AircraftType: int
{
    case OTHER = 0;

    case PISTON_SINGLE = 1;
    case PISTON_TWIN = 2;
    case TURBOPROP_SINGLE = 5;
    case TURBOPROP_TWIN = 6;
    //case JET_SINGLE = 10;
    case JET_TWIN = 11;
    case HELI_SINGLE = 15;
    case HELI_TWIN = 16;

    public function label(): string
    {
        return match($this) {
            self::OTHER => 'Other',
            self::PISTON_SINGLE => 'Piston Single',
            self::PISTON_TWIN => 'Piston Twin',
            self::TURBOPROP_SINGLE => 'Turboprop Single',
            self::TURBOPROP_TWIN => 'Turboprop Twin',
            self::JET_TWIN => 'Jet Twin',
            self::HELI_SINGLE => 'Heli Single',
            self::HELI_TWIN => 'Heli Twin',
        };
    }
}
