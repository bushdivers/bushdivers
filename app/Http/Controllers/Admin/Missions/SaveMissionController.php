<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJob;
use Illuminate\Http\Request;

class SaveMissionController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, CommunityJob $communityJob): \Illuminate\Http\RedirectResponse
    {
        $communityJob->name = $request->name;
        $communityJob->description = $request->description;
        $communityJob->allow_private = $request->allow_private ?? false;
        // hub_airport_id is immutable after creation - set only during CreateMissionsController
        $communityJob->save();

        return redirect()->back()->with('success', 'Mission updated successfully');
    }
}
