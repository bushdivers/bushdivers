<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJobContract;
use Illuminate\Http\Request;

class DeleteJobController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $id)
    {
        $job = CommunityJobContract::find($id);
        $job->delete();
        return redirect()->back()->with(['success' => 'Job removed.']);
    }
}
