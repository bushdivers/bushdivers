<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUserPrivilegesRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UpdateUserPrivilegesController extends Controller
{
    public function __invoke(AdminUserPrivilegesRequest $request, int $userId): RedirectResponse
    {
        $user = User::findOrFail($userId);

        $revokingAdmin = $user->is_admin && ! $request->boolean('is_admin');

        if ($revokingAdmin && $userId === $request->user()->id) {
            return redirect()->back()->with(['error' => 'You cannot remove your own admin access']);
        }

        if ($revokingAdmin && User::where('is_admin', true)->count() <= 2) {
            return redirect()->back()->with(['error' => 'Cannot remove the last admin — at least two admins must remain']);
        }

        $user->is_admin = $request->boolean('is_admin');
        $user->save();

        $user->roles()->sync($request->input('roles', []));

        return redirect()->back()->with(['success' => 'User privileges updated']);
    }
}
