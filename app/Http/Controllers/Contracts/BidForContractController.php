<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractInfo;
use App\Services\Contracts\StoreContracts;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class BidForContractController extends Controller
{
    protected StoreContracts $storeContract;

    public function __construct(StoreContracts $storeContract)
    {
        $this->storeContract = $storeContract;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $contract = Contract::find($request->id);
        $contract->user_id = $request->userId;
        $contract->is_available = false;
        $contract->save();

        Cache::forget($contract->dep_airport_id.'-contracts');

        return \response()->json(['message' => 'Contract saved!'], 201);

        // return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport])->with(['success' => 'Contract accepted successfully']);
    }
}
