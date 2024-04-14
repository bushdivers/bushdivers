<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;

class DeleteTourController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tour = Tour::find($request->id);
        // delete tour checkpoints and aircraft
        $tour->aircraft()->delete();
        $tour->checkpoints()->delete();
        $tour->delete();
        return redirect()->back()->with('success', 'Tour deleted.');
    }
}
