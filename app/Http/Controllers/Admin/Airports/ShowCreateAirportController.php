<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowCreateAirportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Admin/AirportEdit', [
            'airport' => null,
            'isEdit' => false,
            'countries' => DB::table('airports')
                ->select('country', 'country_code')
                ->distinct()
                ->whereNotNull('country')
                ->orderBy('country')
                ->get()
        ]);
    }
}
