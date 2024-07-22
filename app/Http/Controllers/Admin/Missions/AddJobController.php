<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJobContract;
use Illuminate\Http\Request;

class AddJobController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $id)
    {
        $job = new CommunityJobContract();
        $job->dep_airport_id = $request->departure;
        $job->arr_airport_id = $request->destination;
        $job->cargo_type = $request->cargo_type;
        $job->payload = $request->cargo_type == 1 ? $request->qty : null;
        $job->pax = $request->cargo_type == 2 ? $request->qty : null;
        $job->remaining_payload = $request->cargo_type == 1 ? $request->qty : null;
        $job->remaining_pax = $request->cargo_type == 2 ? $request->qty : null;
        $job->cargo = $request->cargo;
        $job->is_recurring = $request->recurring;
        $job->community_job_id = $id;
        $job->save();

        return redirect()->back()->with(['success' => 'Job added.']);
    }
}
