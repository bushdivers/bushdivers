<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJob;
use Illuminate\Http\Request;

class DeleteMissionController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, CommunityJob $communityJob): \Illuminate\Http\RedirectResponse
    {
        $communityJob->delete();
        return redirect()->back()->with('success', 'Mission deleted successfully');
    }
}
