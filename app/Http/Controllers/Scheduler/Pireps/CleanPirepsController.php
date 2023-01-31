<?php

namespace App\Http\Controllers\Scheduler\Pireps;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use App\Services\Pireps\FindInactivePireps;
use App\Services\Pireps\RemoveMultiplePireps;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CleanPirepsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, FindInactivePireps $findInactivePireps, RemoveMultiplePireps $removeMultiplePireps): JsonResponse
    {
        try {
            $inactive = $findInactivePireps->execute();
            $removeMultiplePireps->execute($inactive);
            return response()->json(['message' => 'Successfully processed pirep cleanse']);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
