<?php

namespace App\Http\Controllers\Auth;

use App\General\MailTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordResetRequest;
use App\Models\User;
use App\Services\Email\SendEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

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
        // create request uuid
        $user = User::where('reset_token', $request->token)->firstorFail();
        $user->password = Hash::make($request->password);
        $user->reset_token = null;
        $user->save();

        // send email
        $body = MailTypes::passwordReset($user);
        $this->sendEmail->execute($body);

        // redirect to login
        return redirect()->route('login.index')->with(['success' => 'Password reset successfully, please login']);
    }
}
