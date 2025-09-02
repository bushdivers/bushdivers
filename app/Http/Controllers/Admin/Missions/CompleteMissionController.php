<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Contract;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\TransactionTypes;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CompleteMissionController extends Controller
{
    protected AddAirlineTransaction $addAirlineTransaction;
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AddAirlineTransaction $addAirlineTransaction, AddUserTransaction $addUserTransaction)
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->addUserTransaction = $addUserTransaction;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $mission = CommunityJob::find($request->id);
        $mission->is_completed = 1;
        $mission->completed_at = Carbon::now();
        $mission->save();

        // find recurring
        $jobs = CommunityJobContract::where('community_job_id', $request->id)->get();
        foreach ($jobs as $job) {
            if ($job->is_recurring) {
                $job->is_completed = 1;
                $job->completed_at = Carbon::now();
                $job->save();
            }
            $jobContracts = Contract::where('community_job_contract_id', $job->id)->get();

            foreach ($jobContracts as $contract) {
                $userId = $contract->user_id;
                if ($userId == 0)
                    continue;

                $this->addAirlineTransaction->execute(AirlineTransactionTypes::ContractExpenditure, round($contract->contract_value/2), 'Community Bonus');
                $this->addUserTransaction->execute($userId, TransactionTypes::Bonus, round($contract->contract_value/2));
            }
        }



        return redirect()->back()->with(['success' => 'Mission completed.']);
    }
}
