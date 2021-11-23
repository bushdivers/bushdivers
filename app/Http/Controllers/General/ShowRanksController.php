<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\Rank;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowRanksController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $ranks = Rank::all();
        $awards = Award::all();
        return Inertia::render('General/Ranks', ['ranks' => $ranks, 'awards' => $awards]);
    }
}
