<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\TransactionTypes;
use App\Models\Fleet;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellAircraftController extends Controller
{
    protected AddUserTransaction $addUserTransaction;
    protected AddAirlineTransaction $addAirlineTransaction;

    public function __construct(AddUserTransaction $addUserTransaction, AddAirlineTransaction $addAirlineTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
        $this->addAirlineTransaction = $addAirlineTransaction;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke($id, $seller): RedirectResponse
    {
        $ac = Aircraft::find($id);
        $fleet = Fleet::find($ac->fleet_id);

        if ($ac->flight_time_mins > $fleet->tbo_mins) {
            $price = $fleet->used_low_price;
        } else {
            $price = $fleet->used_high_price;
        }
        $ac->sale_price = $price;
        $ac->owner_id = null;
        $ac->save();

        if ($seller == 'admin') {
            $this->addAirlineTransaction->execute( AirlineTransactionTypes::GeneralIncome, $price, 'Sale of aircraft', null, 'credit');
        } else {
            $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::AircraftSale, $price);
        }

        return redirect()->back()->with(['success' => 'Aircraft sold']);
    }
}
