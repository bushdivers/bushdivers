<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowMissionsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $missions = CommunityJob::all();
        return Inertia::render('Admin/Missions', ['missions' => $missions]);
    }
}
