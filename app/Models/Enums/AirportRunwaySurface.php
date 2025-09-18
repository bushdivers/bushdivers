<?php

namespace App\Models\Enums;

enum AirportRunwaySurface: string
{
    case ASPHALT = 'A';
    case BITUMINOUS = 'B';
    case CONCRETE = 'C';
    case CEMENT = 'CE';
    case WATER_ALT = 'CR';
    case GRASS = 'G';
    case GRAVEL = 'GR';
    case MACADAM = 'M';
    case SAND = 'S';
    case TARMAC = 'T';
    case WATER = 'W';

    public function label(): string
    {
        return match ($this) {
            self::ASPHALT => 'Asphalt',
            self::BITUMINOUS => 'Bituminous',
            self::CONCRETE => 'Concrete',
            self::CEMENT => 'Cement',
            self::WATER, self::WATER_ALT => 'Water',
            self::GRASS => 'Grass',
            self::GRAVEL => 'Gravel',
            self::MACADAM => 'Macadam',
            self::SAND => 'Sand',
            self::TARMAC => 'Tarmac',
        };
    }
}
