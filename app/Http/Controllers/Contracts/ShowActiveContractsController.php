<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowActiveContractsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $contracts = Contract::with('depAirport', 'arrAirport', 'cargo', 'cargo.currentAirport')
            ->where('is_completed', false)
            ->wheres('is_available', false)
            ->orderBy('expires_at', 'asc')
            ->get();

        return Inertia::render('Contracts/MyContracts', ['contracts' => $contracts]);
    }
}
