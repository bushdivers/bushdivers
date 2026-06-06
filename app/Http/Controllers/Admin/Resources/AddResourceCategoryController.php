<?php

namespace App\Http\Controllers\Admin\Resources;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResourceCategoryRequest;
use App\Models\ResourceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AddResourceCategoryController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ResourceCategoryRequest $request): RedirectResponse
    {
        $cat = new ResourceCategory();
        $cat->category = $request->category;
        $cat->save();

        return redirect()->back()->with(['success' => 'Category added']);
    }
}
