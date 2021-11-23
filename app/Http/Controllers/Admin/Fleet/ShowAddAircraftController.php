<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAddAircraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $fleet = Fleet::all();
        $hubs = Airport::where('is_hub', true)->orderBy('identifier')->get();
        return Inertia::render('Admin/AircraftCreate', ['fleet' => $fleet, 'hubs' => $hubs]);
    }
}
