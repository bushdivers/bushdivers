<?php

namespace App\Http\Controllers\Admin\Tours;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAddTourRequest;
use App\Models\Airport;
use App\Models\Tour;
use Illuminate\Http\Request;

class CreateTourController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(AdminAddTourRequest $request)
    {
        $startAirport = Airport::where('identifier', $request->start)->first();
        if (!$startAirport) {
            return redirect()->back()->with(['error' => 'Invalid starting airport identifier']);
        }

        $tour = new Tour();
        $tour->title = $request->title;
        $tour->description = $request->description;
        $tour->start_airport_id = $startAirport->id;
        $tour->save();

        return redirect()->route('admin.tours.details', ['id' => $tour->id]);
    }
}
