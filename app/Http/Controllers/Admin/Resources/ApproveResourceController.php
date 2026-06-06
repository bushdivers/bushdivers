<?php

namespace App\Http\Controllers\Admin\Resources;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ApproveResourceController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, $id): RedirectResponse
    {
        $resource = Resource::find($id);
        $resource->is_approved = true;
        $resource->save();

        return redirect()->back()->with(['success' => 'Resource approved']);
    }
}
