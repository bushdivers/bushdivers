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
        $loans = Loan::where('is_paid', false)
            ->where('term_remaining', '>', 0)
            ->get();

        foreach ($loans as $loan) {
            if (Carbon::parse($loan->next_payment_at)->endOfDay() != Carbon::now()->endOfDay()) return;
            $user = User::find($loan->user_id);
            $payment = $loan->monthly_payment > $loan->total_remaining ? $loan->total_remaining : $loan->monthly_payment;
            if ($payment > $user->balance) {
                $loan->missed_payments = $loan->missed_payments + 1;
                if ($loan->missed_payments > 3) {
                    $user->is_defaulted = true;
                    $user->save();
                }
                $loan->save();
            } else {
                $this->addUserTransaction->execute($user->id, TransactionTypes::Loan, -$payment);
                $loan->total_remaining = $loan->total_remaining - $payment;
                $loan->term_remaining =  $loan->term_remaining - 1;
                $loan->last_payment_at = Carbon::now();
                $loan->next_payment_at = Carbon::now()->addMonth();
                if ($loan->term_remaining == 0) {
                    $loan->total_remaining = 0;
                    $loan->is_paid = true;
                }
                $loan->save();
            }
        }
    }
}
