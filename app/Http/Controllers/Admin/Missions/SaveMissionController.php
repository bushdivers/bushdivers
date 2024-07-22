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
    public function __invoke(Request $request, $id)
    {
        $mission = CommunityJob::find($id);
        $mission->name = $request->name;
        $mission->description = $request->description;
        $mission->save();
        return redirect()->back()->with('success', 'Mission updated successfully');
    }
}
