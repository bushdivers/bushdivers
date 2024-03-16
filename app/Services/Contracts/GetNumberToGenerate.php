<?php

namespace App\Services\Contracts;

use App\Models\Airport;

class GetNumberToGenerate
{
    public function execute(Airport $airport, int $currentCount): int
    {
        if ($airport->is_hub) return 50 - $currentCount;
        if ($airport->size >= 3) return 30 - $currentCount;
        if ($airport->size == 1 || $airport->size == 2) return 10 - $currentCount;
        if ($airport->size == 0) return 5 - $currentCount;
        return 0;
    }
}
