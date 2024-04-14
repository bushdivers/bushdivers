<?php

namespace App\Http\Controllers\Tours;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowToursController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tours = Tour::with('checkpoints', 'participants')->get();
        return Inertia::render('Tours/Tours', ['tours' => $tours]);
    }
}
