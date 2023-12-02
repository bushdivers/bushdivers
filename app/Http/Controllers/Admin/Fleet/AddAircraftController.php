<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAddAircraft;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\AirlineTransactionTypes;
use App\Services\Aircraft\CreateAircraft;
use App\Services\Finance\AddAirlineTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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

        if ($price >= 999999.99)
            return redirect()->back()->withInput()->with(['error' => 'Too expensive']);

        // Remap some fields to match service
        $data = $request->all();
        $data['id'] = $data['fleet'];
        $data['reg'] = $data['registration'];

        $aircraft = $this->createAircraft->execute($data, 0);

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
