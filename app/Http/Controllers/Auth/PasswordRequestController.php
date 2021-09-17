<?php

namespace App\Http\Controllers\Auth;

use App\General\MailTypes;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\PasswordRequest;
use Ramsey\Uuid\Uuid;

class PasswordRequestController extends Controller
{
    protected EmailService $emailService;

    public function __construct()
    {
        $this->emailService = new EmailService();
    }

    public function index()
    {
        return Inertia::render('Auth/RequestPassword');
    }

    public function request(PasswordRequest $request)
    {
        // create request uuid
        $user = User::where('email', $request->email)->first();
        $user->reset_token = Uuid::uuid4();
        $user->save();

        $url = route('password.reset.index', ['token' => $user->reset_token]);

        // send email
        $body = MailTypes::passwordRequest($user, $url);
        $this->emailService->sendEmail($body);

        // redirect to login
        return redirect()->route('login.index')->with(['success' => 'Password request sent, please check your email']);
    }
}
