<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Enums\ContractType;
use App\Services\Airports\CalcBearingBetweenPoints;
use App\Services\Airports\CalcDistanceBetweenPoints;
use App\Services\Contracts\CalcContractValue;
use App\Services\Contracts\CreateCommunityContract;
use App\Services\Contracts\GenerateContractDetails;
use App\Services\Contracts\StoreContracts;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PublishMissionController extends Controller
{
    protected CreateCommunityContract $createCommunityContract;

    public function __construct(CreateCommunityContract $createCommunityContract)
    {
        $this->createCommunityContract = $createCommunityContract;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $existingMission = CommunityJob::where('is_completed', 0)->where('is_published', 1)->count();
        $hubInProgress = Airport::where('hub_in_progress', 1)->count();
        if ($existingMission > 0 || $hubInProgress > 0) {
            return redirect()->back()->with(['error' => 'Mission/Hub already published.']);
        }

        // create contracts
        $jobs = CommunityJobContract::where('community_job_id', $request->id)->get();
        foreach ($jobs as $job) {
            $this->createCommunityContract->execute($job);
        }

        $mission = CommunityJob::find($request->id);
        $mission->is_published = 1;
        $mission->save();
        return redirect()->back()->with(['success' => 'Mission published.']);
    }
}
