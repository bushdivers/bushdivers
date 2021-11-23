<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SetAdminController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $userId): RedirectResponse
    {
        $user = User::find($userId);
        $user->is_admin = !$user->is_admin;
        $user->save();

        return redirect()->back()->with(['success' => 'User has been updated']);
    }
}
