<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ShowJumpseatController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $user = Auth::user();
        $user->load('location');
        $hubs = Airport::hub()
            ->withRangeTo($user->location)
            ->where('id', '!=', $user->location->id ?? 0)
            ->get();

        return Inertia::render('Crew/Jumpseat', ['user' => $user, 'hubs' => $hubs]);
    }
}
