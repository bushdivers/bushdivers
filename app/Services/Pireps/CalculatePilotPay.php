<?php

namespace App\Services\Pireps;

use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\TransactionTypes;
use App\Models\PirepCargo;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CalculatePilotPay
{
    public function execute($pirep)
    {
        $user = User::find($pirep->user_id);
        $pay = 0.00;

        $pirepCargo = PirepCargo::where('pirep_id', $pirep->id)->get();
        foreach ($pirepCargo as $pc) {
            $cargo = ContractCargo::find($pc->contract_cargo_id);
            $contract = Contract::find($cargo->contract_id);
            if ($contract->is_completed) {
                // add line to user account
                DB::table('user_accounts')->insert([
                    'user_id' => $user->id,
                    'type' => TransactionTypes::FlightPay,
                    'total' => $pay,
                    'flight_id' => $pirep->id
                ]);
            }
        }
    }
}
