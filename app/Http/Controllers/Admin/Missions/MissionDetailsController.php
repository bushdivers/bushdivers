<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MissionDetailsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, CommunityJob $communityJob): \Inertia\Response
    {
        $jobs = CommunityJobContract::with(['departureAirport', 'arrivalAirport'])->where('community_job_id', $communityJob->id)->get();

        $hubAircraft = [];
        if ($communityJob->hub_airport_id ?? false) {
            $hubAircraft = Aircraft::with(['fleet', 'location'])
                ->isFleet()
                ->where('hub_id', $communityJob->hub_airport_id)
                ->get()
                ->map(function ($aircraft) {
                    return [
                        'id' => $aircraft->id,
                        'registration' => $aircraft->registration,
                        'is_ferry' => $aircraft->is_ferry,
                        'ferry_user_id' => $aircraft->ferry_user_id,
                        'fleet' => $aircraft->fleet,
                        'location' => $aircraft->location,
                    ];
                });
        }

        $data = [
            'mission' => $communityJob,
            'jobs' => $jobs,
            'hubAircraft' => $hubAircraft,
        ];

        // Pass bulk upload results if they exist
        if ($request->session()->has('bulkUploadResults')) {
            $data['bulkUploadResults'] = $request->session()->get('bulkUploadResults');
            $request->session()->forget('bulkUploadResults');
        }

        return Inertia::render('Admin/MissionDetails', $data);
    }
}
