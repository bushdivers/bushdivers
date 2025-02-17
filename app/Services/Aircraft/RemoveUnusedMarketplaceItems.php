<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;

class RemoveUnusedMarketplaceItems
{
    /**
     * Remove any generated aircraft that have not been used (ie, marketplace items)
     * @return int Number of items removed
     */
    public function execute(): int
    {
        return Aircraft::whereRaw('`id` NOT IN (SELECT `aircraft_id` FROM `pireps`)')
            ->whereRaw('`id` NOT IN (SELECT `aircraft_id` FROM `finance_agreements`)')
            ->whereNull('user_id')
            ->whereNull('owner_id')
            ->where('is_financed', 0)
            ->where('state', AircraftState::AVAILABLE)
            ->where('status', AircraftStatus::ACTIVE)
            ->whereNull('last_flight')
            ->where('fuel_onboard', '0.0')
            ->whereNull('ferry_user_id')
            ->whereRaw('`updated_at` = `created_at`')
            ->whereRaw('DATE_ADD(`created_at`, INTERVAL 2 MONTH) < NOW()')
            ->delete();
    }
}