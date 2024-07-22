<?php

namespace App\Services\Contracts;

use App\Models\CommunityJob;
use App\Models\CommunityJobContract;

class GenerateRecurringCommunityJobs
{
    protected CreateCommunityContract $createCommunityContract;

    public function __construct(CreateCommunityContract $createCommunityContract)
    {
        $this->createCommunityContract = $createCommunityContract;
    }

    public function execute()
    {
        $communityJob = CommunityJob::where('is_published', 1)->firstOrFail();
        $jobs = CommunityJobContract::where('community_job_id', $communityJob->id)
            ->where('is_recurring', true)
            ->where('is_completed', false)
            ->get();
        foreach ($jobs as $job) {
            $this->createCommunityContract->execute($job);
        }
    }
}
