<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use App\Models\Enums\AircraftStatus;
use App\Models\Fleet;
use App\Services\Finance\GetFinanceData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GetHqController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, GetFinanceData $getFinanceData)
    {
        $finances = $getFinanceData->execute();
        $fleet = Fleet::with(['uploads', 'aircraft' => function ($q) {
            $q->where('owner_id', 0);
            $q->where('status', AircraftStatus::ACTIVE);
            $q->orderBy('hub_id');
        }, 'aircraft.location', 'aircraft.hub', 'aircraft.engines'])
            ->where('company_fleet', true)
            ->orderBy('type');

        $hubs = Airport::where('is_hub', true);
        return Inertia::render('General/BushDivers', [
            'fleet' => fn() => $fleet->get(),
            'hubs' => fn() => $hubs->get(),
            'finances' => $finances]);
    }
}
