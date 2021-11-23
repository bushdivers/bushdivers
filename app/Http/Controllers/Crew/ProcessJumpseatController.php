<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\Enums\TransactionTypes;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProcessJumpseatController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $transactionValue = $request->cost;

        $this->userService->updatePilotLocation($request->icao, Auth::user()->id);
//        $this->userService->updateUserAccountBalance(Auth::user()->id, -$transactionValue);
        $this->userService->addUserAccountEntry(Auth::user()->id, TransactionTypes::Jumpseat, -$transactionValue);

        return redirect()->back()->with(['success' => 'Relocated successfully to '.$request->icao.' at a cost of $'.$request->cost]);
    }
}
