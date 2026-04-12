<?php

namespace App\Models\Enums;

enum SimType: string
{
    case MSFS2020 = 'fs20';
    case MSFS2024 = 'fs24';

    public function label(): string
    {
        return match ($this) {
            self::MSFS2020 => 'MSFS 2020',
            self::MSFS2024 => 'MSFS 2024',
        };
    }
}
