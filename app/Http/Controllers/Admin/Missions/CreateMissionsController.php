<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJob;
use Illuminate\Http\Request;

class CreateMissionsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $mission = new CommunityJob();
        $mission->name = $request->name;
        $mission->description = '';
        $mission->save();

        return redirect()->route('admin.mission.details', $mission->id);
    }
}
