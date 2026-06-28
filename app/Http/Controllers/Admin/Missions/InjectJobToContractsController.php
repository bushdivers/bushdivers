<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJobContract;
use App\Services\Contracts\CreateCommunityContract;
use Illuminate\Http\Request;

class InjectJobToContractsController extends Controller
{
    protected CreateCommunityContract $createCommunityContract;

    public function __construct(CreateCommunityContract $createCommunityContract)
    {
        $this->createCommunityContract = $createCommunityContract;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, CommunityJobContract $communityJobContract): \Illuminate\Http\RedirectResponse
    {
        $communityJobContract->load('communityJob');

        // Only allow injection for published missions
        if (!$communityJobContract->communityJob->is_published) {
            return redirect()->back()->with(['error' => 'Can only dispatch jobs for published missions']);
        }

        try {
            $this->createCommunityContract->execute($communityJobContract);

            return redirect()->back()->with(['success' => 'Job successfully dispatched']);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error' => 'Failed to dispatch job: ' . $e->getMessage()]);
        }
    }
}
