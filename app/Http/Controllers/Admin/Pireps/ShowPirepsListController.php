<?php

namespace App\Http\Controllers\Admin\Pireps;

use App\Http\Controllers\Controller;
use App\Models\Pirep;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowPirepsListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $pireps = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
            ->orderBy('submitted_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Pireps', ['pireps' => $pireps]);
    }
}
