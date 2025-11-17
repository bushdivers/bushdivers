<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowToursController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $tours = Tour::with('aircraft', 'participants', 'checkpoints', 'startingAirport')->get();
        return Inertia::render('Admin/TourList', ['tours' => $tours]);
    }
}
