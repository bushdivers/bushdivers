<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowUpdateFleetController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $id): Response
    {
        $fleet = Fleet::with('uploads')->find($id);
        $fleet->tbo_mins = $fleet->tbo_mins / 60;
        $mfg = \App\Models\Manufacturer::all();
        return Inertia::render('Admin/FleetEdit', ['fleet' => $fleet, 'manufacturers' => $mfg]);
    }
}
