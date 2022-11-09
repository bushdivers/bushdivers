<?php

namespace App\Http\Controllers\Loans;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoanRequest;
use App\Models\Enums\TransactionTypes;
use App\Models\Loan;
use App\Services\Finance\AddUserTransaction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ApplyForLoanController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(LoanRequest $request, AddUserTransaction $addUserTransaction): RedirectResponse
    {
        $loan = new Loan();
        $loan->user_id = Auth::user()->id;
        $loan->loan_amount = $request->loanAmount;
        $loan->total_interest = $request->interest;
        $loan->total_remaining = $request->total;
        $loan->term_months = $request->term;
        $loan->term_remaining = $request->term;
        $loan->monthly_payment = $request->payment;
        $loan->next_payment_at = Carbon::now()->addMonth();
        $loan->missed_payments = 0;
        $loan->save();

        $addUserTransaction->execute(Auth::user()->id, TransactionTypes::Loan, $request->total);

        return redirect()->back()->with(['success' => 'Loan accepted']);
    }
}
