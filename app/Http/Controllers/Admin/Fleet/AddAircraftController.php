<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAddAircraft;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\AirlineTransactionTypes;
use App\Services\Aircraft\CreateAircraft;
use App\Services\Finance\AddAirlineTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class AddAircraftController extends Controller
{
    protected $addAirlineTransaction;
    protected $createAircraft;

    public function __construct(AddAirlineTransaction $addAirlineTransaction, CreateAircraft $createAircraft)
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->createAircraft = $createAircraft;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(AdminAddAircraft $request): RedirectResponse
    {
        $price = floatval($request->cost);
        $price = abs($price);

        // Remap some fields to match service
        $data = $request->all();
        $data['id'] = $data['fleet'];
        $data['reg'] = $data['registration'];

        $currentAirport = Airport::where('identifier', Str::upper($data['deliveryIcao']))->first();

        $aircraft = $this->createAircraft->execute($data, null, $currentAirport);

        if (!$aircraft)
            return redirect()->back()->withInput()->with(['error' => 'Failed to create aircraft']);

        if ($price > 0.0)
            $this->addAirlineTransaction->execute(
                AirlineTransactionTypes::GeneralExpenditure,
                $price,
                'Aircraft purchase',
                null,
                'debit');

        return redirect()->route('admin.fleet')->with(['success' => 'Aircraft created']);
    }
}
