<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LookupUserController extends Controller
{
    public function __invoke(Request $request, string $userId): JsonResponse
    {
        // Accept both numeric ID (42) and pilot ID format (BDV0042)
        $numericId = (int) preg_replace('/^BDV0*/i', '', $userId);

        $user = User::with('roles')->find($numericId);

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'id'               => $user->id,
            'pilot_id'         => $user->pilot_id,
            'name'             => $user->name,
            'discord_username' => $user->discord_username,
            'msfs_username'    => $user->msfs_username,
            'is_admin'         => (bool) $user->is_admin,
            'user_roles'       => $user->user_roles,
        ]);
    }
}
