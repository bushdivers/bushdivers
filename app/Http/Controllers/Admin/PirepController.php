<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PirepController extends Controller
{
    public function index(): Response
    {
        $pireps = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
            ->orderBy('submitted_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Pireps', ['pireps' => $pireps]);
    }
}
