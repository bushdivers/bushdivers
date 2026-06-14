<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\AccountLedger;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Enums\AirlineTransactionTypes;
use App\Services\Contracts\CreateCommunityContract;
use App\Services\Finance\AddAirlineTransaction;
use Illuminate\Http\Request;

class PublishMissionController extends Controller
{
    public const HUB_SUPPLIES_COST = 120000;
    protected CreateCommunityContract $createCommunityContract;
    protected AddAirlineTransaction $addAirlineTransaction;

    public function __construct(
        CreateCommunityContract $createCommunityContract,
        AddAirlineTransaction $addAirlineTransaction
    ) {
        $this->createCommunityContract = $createCommunityContract;
        $this->addAirlineTransaction = $addAirlineTransaction;
    }


    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): \Illuminate\Http\RedirectResponse
    {
        $existingMission = CommunityJob::where('is_completed', 0)->where('is_published', 1)->count();
        $hubInProgress = Airport::where('hub_in_progress', 1)->count();
        if ($existingMission > 0 || $hubInProgress > 0) {
            return redirect()->back()->with(['error' => 'A community mission already in progress.']);
        }

        $mission = CommunityJob::find($request->id);

        // If this is a hub event, check hub airport and funds
        if ($mission->hub_airport_id) {
            $hubAirport = Airport::find($mission->hub_airport_id);
            if (!$hubAirport) {
                return redirect()->back()->with(['error' => 'Hub airport not found.']);
            }
            if ($hubAirport->is_hub) {
                return redirect()->back()->with(['error' => 'Selected airport is already a hub.']);
            }

            // Check funds for supplies cost
            $suppliesCost = self::HUB_SUPPLIES_COST;
            $balance = AccountLedger::getBalance();
            if ($balance < $suppliesCost) {
                return redirect()->back()->with(['error' => 'Insufficient funds for hub supplies ($' . number_format($suppliesCost) . ').']);
            }
        }

        // create contracts from mission jobs
        $jobs = CommunityJobContract::where('community_job_id', $request->id)->get();
        foreach ($jobs as $job) {
            $this->createCommunityContract->execute($job);
        }

        // If this is a hub event, activate hub and charge supplies cost
        if ($mission->hub_airport_id) {
            $hubAirport = Airport::find($mission->hub_airport_id);
            $hubAirport->is_hub = true;
            $hubAirport->hub_in_progress = true;
            $hubAirport->save();

            $suppliesCost = self::HUB_SUPPLIES_COST;
            $this->addAirlineTransaction->execute(
                AirlineTransactionTypes::GeneralExpenditure,
                $suppliesCost,
                'Hub Supplies - '.$hubAirport->identifier,
                null,
                'debit'
            );
        }

        $mission->is_published = 1;
        $mission->save();
        return redirect()->back()->with(['success' => 'Mission published.']);
    }
}
