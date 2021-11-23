<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowSupportersController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $supporters = User::where('is_supporter', true)->get();
        return  Inertia::render('General/Supporters', ['supporters' => $supporters]);
    }
}
