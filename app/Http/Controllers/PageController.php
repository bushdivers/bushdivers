<?php

namespace App\Http\Controllers;

use App\Models\Award;
use App\Models\Rank;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function ranks(): Response
    {
        $ranks = Rank::all();
        $awards = Award::all();
        return Inertia::render('General/Ranks', ['ranks' => $ranks, 'awards' => $awards]);
    }

    public function staff(): Response
    {
        $staff = Staff::with('user')->get();
        return Inertia::render('General/Staff', ['staff' => $staff]);
    }
}
