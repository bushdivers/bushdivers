<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use App\Models\Airport;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CrewController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Crew/Dashboard');
    }

    public function roster(): Response
    {
        $users = User::with('rank', 'location')
            ->where('is_active', true)
            ->get();

        return Inertia::render('Crew/Roster', ['roster' => $users]);
    }

    public function profile(): Response
    {
        $user = User::with('hub')->find(Auth::user()->id);
        $hubs = Airport::where('is_hub', true)->orderBy('identifier')->get();

        $hubs = $hubs->filter(function ($value, $key) use ($user) {
            return $value != $user->hub_id;
        });

        return Inertia::render('Crew/Profile', ['profile' => $user, 'hubs' => $hubs]);
    }

    public function updateProfile(ProfileRequest $request): RedirectResponse
    {
        $user = User::find(Auth::user()->id);
        if ($user->email != $request->email) {
            if (User::where('email', $request->email)->count() > 0) {
                return redirect()->back()->with(['error' => 'This email is already taken']);
            }
            $user->email = $request->email;
        }

        $user->name = $request->name;
        $user->msfs_username = $request->msfs_username;
        $user->volanta_username = $request->volanta_username;
        $user->discord_username = $request->discord_username;
        $user->opt_in = $request->opt_in;
        if (isset($request->password)) {
            if (strlen($request->password) < 6) {
                return redirect()->back()->with(['error' => 'Password must be 6 or more characters']);
            }
            $user->password = Hash::make($request->password);
        }
        $user->save();

        return redirect()->back()->with(['success' => 'Profile updated']);
    }

    public function transferHub(Request $request): RedirectResponse
    {
        $user = User::find(Auth::user()->id);
        $user->hub_id = $request->hub;
        $user->save();

        return redirect()->back()->with(['success' => 'Transferred to '.$request->hub]);
    }
}
