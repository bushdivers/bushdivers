<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MissionDetailsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke($id)
    {
        $mission = CommunityJob::find($id);
        $jobs = CommunityJobContract::with(['departureAirport', 'arrivalAirport'])->where('community_job_id', $id)->get();
        return Inertia::render('Admin/MissionDetails', ['mission' => $mission, 'jobs' => $jobs]);
    }
}
