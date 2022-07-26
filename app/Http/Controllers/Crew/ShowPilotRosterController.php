<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ShowPilotRosterController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $sortBy = $request->sortBy != null ? $request->sortBy : 'id';
        $direction = $request->direction != null ? $request->direction : 'asc';

        if (Cache::has('roster')) {
            $users = Cache::get('roster');
        } else {
            $users = User::with('rank', 'location')
                ->where('is_active', true)
                ->orderBy('id')
                ->get();
            Cache::put('roster', $users, now()->addMinutes(720));
        }

        return Inertia::render('Crew/Roster', ['roster' => $users->sortBy([
            [$sortBy, $direction]
        ])]);
    }
}
