<?php

namespace App\Models\Enums;

enum ContractType: int
{
    // These values are used in the codebase and database, so do not change them
    case General = 1;
    case VIP = 2;
    case Community = 3;
    case Ferry = 4;
    case Hub = 5;
}
