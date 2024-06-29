<?php

namespace App\Http\Controllers\Admin\Hubs;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Fleet;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class ShowHubsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $hubs = Airport::where('is_hub', true)->orderBy('country', 'asc')->orderBy('name')->get();
        $fleet = Fleet::where('company_fleet', true)->orderBy('type')->get();
        return Inertia::render('Admin/HubsList', ['hubs' => $hubs, 'fleet' => $fleet]);
    }
}
