<?php

namespace App\Http\Controllers\Auth;

use App\General\MailTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordResetRequest;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    protected EmailService $emailService;

    public function __construct()
    {
        $this->emailService = new EmailService();
    }

    public function index($token)
    {
        return Inertia::render('Auth/ResetPassword', ['token' => $token]);
    }

    public function reset(PasswordResetRequest $request)
    {
        // create request uuid
        $user = User::where('reset_token', $request->token)->firstorFail();
        $user->password = Hash::make($request->password);
        $user->reset_token = null;
        $user->save();

        // send email
        $body = MailTypes::passwordReset($user);
        $this->emailService->sendEmail($body);

        // redirect to login
        return redirect()->route('login.index')->with(['success' => 'Password reset successfully, please login']);
    }
}
