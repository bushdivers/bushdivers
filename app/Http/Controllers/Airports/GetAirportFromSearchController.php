<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GetAirportFromSearchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $search): JsonResponse
    {
        // @TODO: depending on instance, sometimes may or may not want third-party airports
        $airport = Airport::when($request->get('base', false), function (Builder $q) {
                $q->base();
            })
            ->when($request->get('user', false) && Auth::user(), function (Builder $q) {
                $q->forUser(Auth::user());
            })
            ->where('identifier', $search)->first();

        return response()->json(['airport' => $airport]);
    }
}
