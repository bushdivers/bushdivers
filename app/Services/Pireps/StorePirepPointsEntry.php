<?php

namespace App\Services\Pireps;

use App\Models\Point;

class StorePirepPointsEntry
{
    public function execute(string $pirepId, string $type, int $points)
    {
        $entry = new Point();
        $entry->pirep_id = $pirepId;
        $entry->type_name = $type;
        $entry->points = $points;
        $entry->save();
    }
}
