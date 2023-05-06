<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowUserFinancesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $accounts = DB::table('user_accounts')->where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->paginate(15);
        $balance = DB::table('user_accounts')->where('user_id', Auth::user()->id)->get();
        $loanAvailable = (50000 + (($balance->sum('total') - Auth::user()->loan)* 0.4)) - Auth::user()->loan;
        if ($loanAvailable < 0) $loanAvailable = 0;
        return Inertia::render('Crew/MyFinances', ['accounts' => $accounts, 'balance' => $balance->sum('total'), 'loanAvailable' => $loanAvailable]);
    }
}
