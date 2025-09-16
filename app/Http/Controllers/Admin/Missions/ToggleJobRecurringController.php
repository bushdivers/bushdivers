<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJobContract;
use Illuminate\Http\Request;

class ToggleJobRecurringController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $id)
    {
        $job = CommunityJobContract::findOrFail($id);
        $job->is_recurring = !$job->is_recurring;
        $job->save();

        $status = $job->is_recurring ? 'enabled' : 'disabled';

        return redirect()->back()->with(['success' => "Job recurring status {$status} successfully"]);
    }
}
