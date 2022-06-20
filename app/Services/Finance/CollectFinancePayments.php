<?php

namespace App\Services\Finance;

use App\Models\Aircraft;
use App\Models\Enums\TransactionTypes;
use App\Models\FinanceAgreement;
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
        // get all unpaid agreements
        $agreements = FinanceAgreement::where('is_paid', false)->where('amount_remaining', '>', 0)->where('is_cancelled', false)->get();
        // loop through and check user's balance
        foreach ($agreements as $agreement) {
            $user = User::find($agreement->user_id);
            if ($agreement->monthly_payments > $user->balance) {
                $agreement->missed_payments = $agreement->missed_payments + 1;
                $agreement->save();
            } else {
                $this->addUserTransaction->execute($user->id, TransactionTypes::AircraftPurchase, -$agreement->monthly_payments);
                $agreement->amount_remaining = $agreement->amount_remaining - $agreement->monthly_payments;
                $agreement->term_remaining = $agreement->term_remaining - 1;
                $agreement->last_payment_at = Carbon::now();
                $agreement->save();
            }
        }

        // update paid status
        $paidAgreements = FinanceAgreement::where('is_paid', false)
            ->where('amount_remaining', 0)
            ->get();

        foreach ($paidAgreements as $p) {
            $p->is_paid = true;
            $p->save();
            $aircraft = Aircraft::find($p->aircraft_id);
            $aircraft->is_financed = false;
            $aircraft->save();
        }

        // reclaim aircraft for defaulted
        $defaulted = FinanceAgreement::where('is_paid', false)
            ->where('amount_remaining', '>', 0)
            ->where('missed_payments', '>', 2)
            ->where('is_active', true)
            ->get();

        foreach ($defaulted as $ag) {
            $ag->is_active = false;
            $ag->save();
            Aircraft::find($ag->aircraft_id)->update(['owner_id' => null]);
        }
    }
}
