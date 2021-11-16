<?php

namespace App\Http\Controllers\Auth;

use App\General\MailTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordRequest;
use App\Models\User;
use App\Services\Email\SendEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class RequestPasswordResetController extends Controller
{
    protected SendEmail $sendEmail;

    public function __construct(SendEmail $sendEmail)
    {
        $this->sendEmail = $sendEmail;
    }
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(PasswordRequest $request): RedirectResponse
    {
        // create request uuid
        $user = User::where('email', $request->email)->first();
        $user->reset_token = Uuid::uuid4();
        $user->save();

        $url = route('password.reset.index', ['token' => $user->reset_token]);
        // send email
        $body = MailTypes::passwordRequest($user, $url);
        $this->sendEmail->execute($body);

        // redirect to login
        return redirect()->route('login.index')->with(['success' => 'Password request sent, please check your email']);
    }
}
