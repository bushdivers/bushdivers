<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetResourcesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): JsonResponse
    {
        $resources = Resource::with('category')
            ->where('is_approved', true)
            ->orderBy('category_id')
            ->orderBy('title')
            ->get();
        return response()->json(['resources' => $resources]);
    }
}
