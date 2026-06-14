<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowHubsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $hubs = Airport::hub()->orderBy('country', 'asc')->get();
        return Inertia::render('Airports/Hubs', ['hubs' => $hubs]);
    }
}
