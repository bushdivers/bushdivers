<?php

namespace App\Http\Controllers;

use App\Models\Award;
use App\Models\Rank;
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
}
