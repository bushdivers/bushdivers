<?php

namespace App\Http\Controllers\Loans;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoanRequest;
use App\Models\Enums\TransactionTypes;
use App\Models\User;
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
        $user = User::find(Auth::user()->id);
        if ($request->transaction === 'borrow') {
            $user->loan = $user->loan + $request->loanAmount;
            $addUserTransaction->execute(Auth::user()->id, TransactionTypes::Loan, $request->loanAmount);
            $message = 'Loan amount added to balance';
        } else {
            $user->loan = $user->loan - $request->loanAmount;
            $addUserTransaction->execute(Auth::user()->id, TransactionTypes::Loan, -$request->loanAmount);
            $message = 'Loan amount repayed';
        }

        $user->save();

        return redirect()->back()->with(['success' => $message]);
    }
}
