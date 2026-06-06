<?php

namespace App\Http\Controllers\Admin\Resources;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\ResourceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RemoveResourceCategoryController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $id): RedirectResponse
    {
        $cat = ResourceCategory::findOrFail($id);
        $resourceCount = Resource::where('category_id', $id)->count();

        if ($resourceCount > 0) {
            return redirect()->back()->with(['error' => 'Cannot remove category as it is currently assigned resources']);
        }

        $cat->delete();
        return redirect()->back()->with(['success' => 'Category removed']);
    }
}
