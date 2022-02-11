<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowCompletedContractsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $contracts = Contract::with('depAirport', 'arrAirport', 'cargo')
            ->where('is_completed', true)
            ->orderBy('completed_at', 'desc')
            ->paginate(10);

        return Inertia::render('Contracts/CompletedContracts', ['contracts' => $contracts]);
    }
}
