<?php

namespace App\Services\Finance;

use App\Models\Aircraft;
use App\Models\Enums\TransactionTypes;
use App\Models\FinanceAgreement;
use App\Models\Loan;
use App\Models\User;
use Carbon\Carbon;

class CollectFinancePayments
{
    protected AddUserTransaction $addUserTransaction;

    public function __construct(AddUserTransaction $addUserTransaction)
    {
        $this->addUserTransaction = $addUserTransaction;
    }

    public function execute()
    {
        $startDate = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->endOfDay();
        $loans = Loan::where('is_paid', false)->get();

        foreach ($loans as $loan) {
            $user = User::find($loan->user_id);
            if (Carbon::parse($loan->next_payment_at)->between($startDate, $endDate)) {
                if ($loan->monthly_payment > $user->balance) {
                    $loan->missed_payments = $loan->missed_payments + 1;
                    $loan->save();
                } else {
                    $this->addUserTransaction->execute($user->id, TransactionTypes::Loan, -$loan->monthly_payment);
                    $loan->total_remaining = $loan->total_remaining - $loan->monthly_payment;
                    $loan->term_remaining =  $loan->term_remaining - 1;
                    $loan->last_payment_at = Carbon::now();
                    if ($loan->term_remaining == 0) $loan->is_paid = true;
                    $loan->save();
                }
            }
        }
    }
}
