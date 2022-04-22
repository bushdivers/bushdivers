<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractInfo;
use App\Services\Contracts\StoreContract;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BidForContractController extends Controller
{
    protected StoreContract $storeContract;

    public function __construct(StoreContract $storeContract)
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
        $cargo = ['name' => $request->contract['cargo'], 'type' => $request->contract['cargo_type'], 'qty' => $request->contract['cargo_qty']];

        $data = new ContractInfo();
        $data->setStart($request->contract['departure']);
        $data->setDest($request->contract['destination']['identifier']);
        $data->setDistance($request->contract['distance']);
        $data->setHeading($request->contract['heading']);
        $data->setCargo($cargo);
        $data->setValue($request->contract['contract_value']);
        $data->setCustom(false);
        $expiry = Carbon::parse($request->contract['expires_at']);
        $this->storeContract->execute($data, $expiry);

        return \response()->json(['message' => 'Contract saved!'], 201);

        // return Inertia::render('Contracts/Contracts', ['contracts' => $contracts, 'airport' => $airport])->with(['success' => 'Contract accepted successfully']);
    }
}
