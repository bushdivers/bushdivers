<?php

namespace App\Services\Pireps;

use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Carbon\Carbon;

class FindInactivePireps
{
    public function execute()
    {
        $dateToCompare = Carbon::now()->subHours(8);

        $dispatch = Pirep::where('state', PirepState::DISPATCH)
            ->where('updated_at', '<', Carbon::now()->subHours(8))
            ->get();

        $inProgress = Pirep::where('state', PirepState::IN_PROGRESS)
            ->where('updated_at', '<', Carbon::now()->subHours(2))
            ->get();

        return $dispatch->merge($inProgress);
    }
}
