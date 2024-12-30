<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordResetRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller
{
    public function __construct()
    {
    }

    /**
     * Handle the incoming request.
     *
     * @param  PasswordResetRequest  $request
     * @return RedirectResponse
     */
    public function __invoke(PasswordResetRequest $request): RedirectResponse
    {
        $status = Password::reset($request->only(['email', 'password', 'password_confirmation', 'token']),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->remember_token = Str::random(60);
                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('login.index')->with(['success' => 'Password reset successfully, please login.']);
        }
        else if ($status == Password::INVALID_TOKEN) {
            return redirect()->back()->with(['error' => 'Invalid token. Please request a new password reset.']);
        }

        return redirect()->back()->with(['error' => 'Error resetting password.']);
    }
}
