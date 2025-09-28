<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Services\Contracts\CreateCommunityContract;
use Illuminate\Http\Request;

class AddJobController extends Controller
{
    protected CreateCommunityContract $createCommunityContract;

    public function __construct(CreateCommunityContract $createCommunityContract)
    {
        $this->createCommunityContract = $createCommunityContract;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $id)
    {
        $mission = CommunityJob::findOrFail($id);
        $from = Airport::where('identifier', $request->departure)->firstOrFail();
        $to = Airport::where('identifier', $request->destination)->firstOrFail();

        if (!$from) {
            return redirect()->back()->with(['error' => 'Departure airport not found.']);
        }
        if (!$to) {
            return redirect()->back()->with(['error' => 'Destination airport not found.']);
        }

        $job = new CommunityJobContract();
        $job->dep_airport_id = $from->id;
        $job->arr_airport_id = $to->id;
        $job->cargo_type = $request->cargo_type;
        $job->payload = $request->cargo_type == 1 ? $request->qty : null;
        $job->pax = $request->cargo_type == 2 ? $request->qty : null;
        $job->remaining_payload = $request->cargo_type == 1 ? $request->qty : null;
        $job->remaining_pax = $request->cargo_type == 2 ? $request->qty : null;
        $job->cargo = $request->cargo;
        $job->is_recurring = $request->recurring;
        $job->community_job_id = $id;
        $job->save();

        $message = 'Job added.';

        // If mission is published and inject_immediately is checked, inject into contracts
        if ($mission->is_published && $request->inject_immediately) {
            try {
                $this->createCommunityContract->execute($job);
                $message = 'Job added and injected into contracts successfully.';
            } catch (\Exception $e) {
                $message = 'Job added but failed to inject into contracts: ' . $e->getMessage();
            }
        }

        return redirect()->back()->with(['success' => $message]);
    }
}
