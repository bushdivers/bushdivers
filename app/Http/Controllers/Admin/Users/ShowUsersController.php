<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowUsersController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $users = User::with('roles')
            ->where('is_admin', true)
            ->orWhereHas('roles')
            ->orderBy('id', 'asc')
            ->get();

        $users->makeVisible(['msfs_username', 'discord_username', 'is_admin', 'user_roles']);

        $roles = Role::orderBy('role')->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }
}
