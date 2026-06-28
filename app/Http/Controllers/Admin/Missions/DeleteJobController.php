<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJobContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeleteJobController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, CommunityJobContract $communityJobContract): RedirectResponse
    {
        $communityJobContract->delete();
        return redirect()->back()->with(['success' => 'Job removed.']);
    }
}
