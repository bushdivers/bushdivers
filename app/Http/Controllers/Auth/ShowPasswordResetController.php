<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowPasswordResetController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param $token
     * @return Response
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $request->token,
            'email' => $request->email,
        ]);
    }
}
