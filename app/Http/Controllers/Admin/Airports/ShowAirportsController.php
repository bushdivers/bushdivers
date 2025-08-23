<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAirportsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $airports = Airport::thirdParty()
            ->orderBy('identifier')
            ->paginate(20);

        return Inertia::render('Admin/Airports', [
            'airports' => $airports
        ]);
    }
}
