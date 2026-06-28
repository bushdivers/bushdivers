<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminMissionJobRequest;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Enums\CargoType;
use App\Services\Contracts\CreateCommunityContract;
use Illuminate\Http\RedirectResponse;

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
    public function __invoke(AdminMissionJobRequest $request, CommunityJob $communityJob): RedirectResponse
    {
        $validated = $request->validated();
        $from = Airport::where('identifier', $validated['departure'])->base()->firstOrFail();
        $to = Airport::where('identifier', $validated['destination'])->base()->firstOrFail();

        $cargoType = CargoType::from($validated['cargo_type']);

        $job = new CommunityJobContract();
        $job->dep_airport_id = $from->id;
        $job->arr_airport_id = $to->id;
        $job->cargo_type = $cargoType;
        $job->forceFill(match ($cargoType) {
            CargoType::Cargo => [
                 'payload' => (int) $validated['qty'],
                 'remaining_payload' => (int) $validated['qty'],
            ],
            CargoType::Passenger => [
                'pax' => (int) $validated['qty'],
                'remaining_pax' => (int) $validated['qty'],
            ],
        });
        $job->cargo = $validated['cargo'];
        $job->is_recurring = $validated['recurring'] ?? false;
        $job->community_job_id = $communityJob->id;
        $job->save();

        $message = 'Job added.';

        // If mission is published and inject_immediately is checked, inject into contracts
        if ($communityJob->is_published && ($validated['inject_immediately'] ?? false)) {
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
