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
        $pw = Hash::make($request->password);
        // create request uuid
        $user = User::where('reset_token', $request->token)->firstorFail();
        $user->password = $pw;
        $user->reset_token = null;
        $user->save();

//        try {
//            DB::connection('mysql_ak')->table('users')->where('email', $user->email)->update([
//                'password' => $pw,
//                'updated_at' => Carbon::now()
//            ]);
//        } catch (\Exception) {
//
//        }

        // send email
        $body = MailTypes::passwordReset($user);
        $this->sendEmail->execute($body);

        // redirect to login
        return redirect()->route('login.index')->with(['success' => 'Password reset successfully, please login']);
    }
}
