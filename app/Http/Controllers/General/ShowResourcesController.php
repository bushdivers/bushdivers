<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\ResourceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowResourcesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $categories = ResourceCategory::with('resources')->get();
        return Inertia::render('General/Resources', ['categories' => $categories]);
    }
}
