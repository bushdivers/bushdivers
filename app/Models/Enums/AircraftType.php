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
}
