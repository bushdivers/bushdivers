<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJobContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ToggleJobRecurringController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, CommunityJobContract $communityJobContract): RedirectResponse
    {
        $communityJobContract->is_recurring = !$communityJobContract->is_recurring;
        $communityJobContract->save();

        $status = $communityJobContract->is_recurring ? 'enabled' : 'disabled';

        return redirect()->back()->with(['success' => "Job recurring status {$status} successfully"]);
    }
}
