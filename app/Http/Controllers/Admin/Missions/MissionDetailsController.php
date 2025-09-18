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
    public function __invoke($id, Request $request)
    {
        $mission = CommunityJob::find($id);
        $jobs = CommunityJobContract::with(['departureAirport', 'arrivalAirport'])->where('community_job_id', $id)->get();

        $data = [
            'mission' => $mission,
            'jobs' => $jobs
        ];

        // Pass bulk upload results if they exist
        if ($request->session()->has('bulkUploadResults')) {
            $data['bulkUploadResults'] = $request->session()->get('bulkUploadResults');
            $request->session()->forget('bulkUploadResults');
        }

        return Inertia::render('Admin/MissionDetails', $data);
    }
}
