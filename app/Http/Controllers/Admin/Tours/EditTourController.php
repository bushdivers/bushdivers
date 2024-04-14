<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;

class EditTourController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tour = Tour::find($request->id);
        $tour->title = $request->title;
        $tour->description = $request->description;
        $tour->start_airport_id = $request->start;
        $tour->save();
        return redirect()->back()->with(['success' => 'Tour updated.']);
    }
}
