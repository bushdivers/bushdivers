<?php

namespace App\Http\Controllers\Auth;

use App\General\MailTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\TransactionTypes;
use App\Models\User;
use App\Services\Email\SendEmail;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\AddUserTransaction;
use App\Services\User\CreateApiToken;
use App\Services\User\CreateUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterNewUserController extends Controller
{
    protected SendEmail $sendEmail;
    protected AddAirlineTransaction $addAirlineTransaction;
    protected AddUserTransaction $addUserTransaction;
    protected CreateUser $createUser;
    protected CreateApiToken $createApiToken;

    public function __construct(
        SendEmail $sendEmail,
        AddAirlineTransaction $addAirlineTransaction,
        AddUserTransaction $addUserTransaction,
        CreateUser $createUser,
        CreateApiToken $createApiToken
    ) {
        $this->sendEmail = $sendEmail;
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
        $user = $this->createUser->execute($request->name, $request->email, $request->password, $request->optin);
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
        $body = MailTypes::register($user);
        $this->sendEmail->execute($body);

        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->route('intro')->with([
                'success' => 'Registered successfully!'
            ]);
        }

        return redirect()->back()->with([
            'error' => 'Error registering'
        ]);
    }
}
