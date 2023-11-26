<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAddAircraft;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\AirlineTransactionTypes;
use App\Services\Finance\AddAirlineTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AddAircraftController extends Controller
{
    protected $addAirlineTransaction;

    public function __construct(AddAirlineTransaction $addAirlineTransaction)
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
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

        $aircraft = new Aircraft();
        $aircraft->fleet_id = $request->fleet;
        $aircraft->current_airport_id = $request->hub;
        $aircraft->hub_id = $request->hub;
        $aircraft->registration = $request->registration;
        $aircraft->state = AircraftState::AVAILABLE;
        $aircraft->status = AircraftStatus::ACTIVE;
        $aircraft->save();

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
