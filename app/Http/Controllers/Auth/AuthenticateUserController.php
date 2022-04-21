<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateUserController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  LoginRequest  $request
     * @return RedirectResponse
     */
    public function __invoke(LoginRequest $request): RedirectResponse
    {
        if (
            Auth::attempt([
              'email' => $request->email,
              'password' => $request->password,
              'is_active' => true
            ], $request->remember)
        ) {
            $request->session()->regenerate();

            return redirect()->intended('dashboard');
        }
        return redirect()->back()->with([
            'error' => 'The provided credentials do not match our records.',
        ]);
    }
}
