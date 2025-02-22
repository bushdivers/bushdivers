<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\Enums\TransactionTypes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowJumpseatController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $user = User::with('location')->find(Auth::user()->id);

        $balance = DB::table('user_accounts')
            ->where('user_id', Auth::user()->id)
            ->sum('total');

        return Inertia::render('Crew/Jumpseat', ['user' => $user, 'balance' => $balance]);
    }
}
