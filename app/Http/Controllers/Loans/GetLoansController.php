<?php

namespace App\Http\Controllers\Loans;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Loan;
use App\Services\Finance\CalculateAvailableLoans;
use App\Services\Finance\GetUserBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GetLoansController extends Controller
{
    protected CalculateAvailableLoans $calculateAvailableLoans;
    protected GetUserBalance $getUserBalance;

    public function __construct(
        GetUserBalance $getUserBalance,
        CalculateAvailableLoans $calculateAvailableLoans
    )
    {
        $this->calculateAvailableLoans = $calculateAvailableLoans;
        $this->getUserBalance = $getUserBalance;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $currentBalance = $this->getUserBalance->execute(Auth::user()->id);
        $aircraft = Aircraft::with('fleet')->where('owner_id', Auth::user()->id)->get();
        $aircraftTotal = 0;
        foreach ($aircraft as $ac) {
            $aircraftTotal += $ac->fleet->used_low_price;
        }
        $existingLoans = Loan::where('user_id', Auth::user()->id)->sum('total_remaining');
        $loanAvailable = $this->calculateAvailableLoans->execute($currentBalance, $aircraftTotal, $existingLoans);

        return Inertia::render('Crew/Loans', ['loanValue' => $loanAvailable]);
    }
}
