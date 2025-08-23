<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowEditAirportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $id): Response
    {
        $airport = Airport::thirdParty()->findOrFail($id);

        return Inertia::render('Admin/AirportEdit', [
            'airport' => $airport,
            'isEdit' => true
        ]);
    }
}
