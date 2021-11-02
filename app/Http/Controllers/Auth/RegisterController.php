<?php

namespace App\Http\Controllers\Auth;

use App\General\MailTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Enums\FinancialConsts;
use App\Models\Enums\TransactionTypes;
use App\Models\User;
use App\Services\EmailService;
use App\Services\FinancialsService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    protected EmailService $emailService;

    public function __construct()
    {
        $this->emailService = new EmailService();
    }

    public function index(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(RegisterRequest $request): RedirectResponse
    {
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->current_airport_id = 'AYMR';
        $user->toc_accepted = true;
        $user->opt_in = $request->optin;
        $user->rank_id = 1;
        $user->save();

        // generate api key
        $token = $user->createToken('bush-tracker');
        $user->api_token = $token->plainTextToken;
        $user->save();

        // add cash bonus
        $financeService = new FinancialsService();
        $userService = new UserService();
        $financeService->addTransaction(AirlineTransactionTypes::GeneralExpenditure, FinancialConsts::WelcomeBonus, $user->pilotId.': Welcome bonus');
        $userService->addUserAccountEntry($user->id, TransactionTypes::Bonus, FinancialConsts::WelcomeBonus);

        // send email
        $body = MailTypes::register($user);
        $this->emailService->sendEmail($body);

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
