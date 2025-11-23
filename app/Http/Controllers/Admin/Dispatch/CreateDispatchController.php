<?php

namespace App\Http\Controllers\Admin\Dispatch;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAddDispatch;
use App\Models\Airport;
use App\Models\Enums\ContractType;
use App\Services\Contracts\GenerateContractDetails;
use App\Services\Contracts\StoreContracts;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateDispatchController extends Controller
{
    protected $generateContractDetails;
    protected $storeContracts;

    public function __construct(GenerateContractDetails $generateContractDetails, StoreContracts $storeContracts)
    {
        $this->generateContractDetails = $generateContractDetails;
        $this->storeContracts = $storeContracts;
    }


    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(AdminAddDispatch $request): RedirectResponse
    {
        // currently base only airports
        $origin = Airport::where('identifier', $request->source_airport_id)->where(function ($q) {
            $q->where('is_thirdparty', false)->orWhere('is_hub', true);
        })->firstOrFail();
        $destination = Airport::where('identifier', $request->destination_airport_id)->where(function ($q) {
            $q->where('is_thirdparty', false)->orWhere('is_hub', true);
        })->firstOrFail();
        $cargoQty = $request->cargo_qty;
        $cargo = DB::table('cargo_types')->where('type', ContractType::Cargo)->inRandomOrder()->first();

        // Generate contract details
        $contractDetails = $this->generateContractDetails->execute($origin, $destination, ['name' => $cargo->text, 'type' => $cargo->type, 'qty' => $cargoQty]);
        if (!$contractDetails || empty($contractDetails))
            return redirect()->back()->with(['error' => 'Failed to generate contract details']);

        // Store the contract
        $this->storeContracts->execute([$contractDetails]);

        return redirect()->back()->with([
            'success' => 'Dispatch created successfully'
        ]);
    }
}
