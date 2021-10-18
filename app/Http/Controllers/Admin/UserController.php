<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('id', 'asc')->paginate(10);
        return Inertia::render('Admin/Users', ['users' => $users]);
    }

    public function setAdmin($userId)
    {
        $user = User::find($userId);
        $user->is_admin = !$user->is_admin;
        $user->save();

        return redirect()->back()->with(['success' => 'User has been updated']);
    }

    public function setStatus($userId)
    {
        $user = User::find($userId);
        $user->is_active = !$user->is_active;
        $user->save();

        return redirect()->back()->with(['success' => 'User has been updated']);
    }
}
