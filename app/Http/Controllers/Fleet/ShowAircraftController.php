<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAircraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $id): Response
    {
        $aircraft = Aircraft::with('fleet', 'pireps')->find($id);
        return Inertia::render('Fleet/Aircraft', ['aircraft' => $aircraft]);
    }
}
