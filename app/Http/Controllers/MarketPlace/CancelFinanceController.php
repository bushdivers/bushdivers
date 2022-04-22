<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\AircraftEngine;
use App\Models\Enums\TransactionTypes;
use App\Models\FinanceAgreement;
use App\Services\Finance\AddUserTransaction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CancelFinanceController extends Controller
{
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AddUserTransaction $addUserTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke($id): RedirectResponse
    {
        $ag = FinanceAgreement::find($id);
        $ag->is_active = false;
        $ag->is_cancelled = true;
        $ag->cancelled_at = Carbon::now();
        $ag->save();

        $ac = Aircraft::find($ag->aircraft_id);
        $ac->owner_id = null;
        $ac->save();

        $this->addUserTransaction->execute(Auth::user()->id, TransactionTypes::MonthlyOwnership, -$ag->monthly_payments);

        return redirect()->back()->with(['success' => 'Finance agreement cancelled']);
    }
}
