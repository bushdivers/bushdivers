<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
}
