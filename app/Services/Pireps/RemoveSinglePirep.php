<?php

namespace App\Services\Pireps;

use App\Models\Pirep;

class RemoveSinglePirep
{
    public function execute($pirepId)
    {
        Pirep::destroy($pirepId);
    }
}
