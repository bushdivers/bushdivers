<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;

class PublishTourController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tour = Tour::find($request->id);
        $tour->is_published = true;
        $tour->save();
        return redirect()->back()->with(['success' => 'Tour has been published']);
    }
}
