<?php

namespace App\Http\Controllers\Auth;

use App\General\MailTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordResetRequest;
use App\Models\User;
use App\Services\Email\SendEmail;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller
{
    protected SendEmail $sendEmail;

    public function __construct(SendEmail $sendEmail)
    {
        $this->sendEmail = $sendEmail;
    }

    /**
     * Handle the incoming request.
     *
     * @param  PasswordResetRequest  $request
     * @return RedirectResponse
     */
    public function __invoke(PasswordResetRequest $request): RedirectResponse
    {
        $status = Password::reset($request->all(),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();

                // send email
                $body = MailTypes::passwordReset($user);
                $this->sendEmail->execute($body);
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('login.index')->with(['success' => 'Password reset successfully, please login']);
        }

        return redirect()->back()->with(['error' => 'Error resetting password']);
    }
}
