<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\ResourceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $categories = ResourceCategory::orderBy('category')->get();
        $resources = Resource::where('user_id', Auth::user()->id)->get();
        return Inertia::render('General/Resources', ['categories' => $categories, 'resources' => $resources]);
    }
}
