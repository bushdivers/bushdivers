<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Ramsey\Uuid\Uuid;

class RequestPasswordResetController extends Controller
{
    public function __construct()
    {
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(PasswordRequest $request): RedirectResponse
    {
        $status = Password::sendResetLink($request->only('email'));

        if ($status == Password::RESET_LINK_SENT) {
            return redirect()->route('login.index')->with(['success' => 'Password request sent, please check your email.']);
        }
        else if ($status == Password::INVALID_USER) {
            return redirect()->back()->with(['error' => 'User not found. Did you mean to register?']);
        }
        else if ($status == Password::RESET_THROTTLED) {
            return redirect()->back()->with(['error' => 'Please wait before trying again.']);
        }
        else {
            return redirect()->back()->with(['error' => 'Error sending password reset.']);
        }
    }
}
