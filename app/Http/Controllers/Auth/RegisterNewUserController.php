<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\TransactionTypes;
use App\Models\User;
use App\Notifications\WelcomeEmail;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use App\Services\User\CreateApiToken;
use App\Services\User\CreateUser;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Ramsey\Uuid\Uuid;

class RegisterNewUserController extends Controller
{
    protected AddAirlineTransaction $addAirlineTransaction;
    protected AddUserTransaction $addUserTransaction;
    protected CreateUser $createUser;
    protected CreateApiToken $createApiToken;

    public function __construct(
        AddAirlineTransaction $addAirlineTransaction,
        AddUserTransaction $addUserTransaction,
        CreateUser $createUser,
        CreateApiToken $createApiToken
    ) {
        $this->addUserTransaction = $addUserTransaction;
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->createUser = $createUser;
        $this->createApiToken = $createApiToken;
    }

    /**
     * Handle the incoming request.
     *
     * @param  RegisterRequest  $request
     * @return RedirectResponse
     */
    public function __invoke(RegisterRequest $request): RedirectResponse
    {
        $user = $this->createUser->execute($request->name, $request->email, $request->password);
        // generate api key
        $this->createApiToken->execute($user);

        // add cash bonus
        $this->addAirlineTransaction->execute(
            AirlineTransactionTypes::GeneralExpenditure,
            FinancialConsts::WelcomeBonus,
            $user->pilotId . ': Welcome bonus'
        );
        $this->addUserTransaction->execute($user->id, TransactionTypes::Bonus, FinancialConsts::WelcomeBonus);

        // send email
        $user->notify(new WelcomeEmail($user));

        return redirect()->route('login')->with([
            'success' => 'Registered successfully!'
        ]);
    }
}
