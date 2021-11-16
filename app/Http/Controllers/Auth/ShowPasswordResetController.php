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
    public function __invoke($token): Response
    {
        return Inertia::render('Auth/ResetPassword', ['token' => $token]);
    }
}
