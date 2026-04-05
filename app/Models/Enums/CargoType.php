<?php

namespace App\Models\Enums;

enum CargoType: int
{
    case Cargo = 1;
    case Passenger = 2;
    //case Generic = 3; We assume value is either cargo or pax. code will break if it's not
}

