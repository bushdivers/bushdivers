<?php

namespace App\Http\Controllers\Admin\Resources;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResourceRequest;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AddResourcesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(ResourceRequest $request): RedirectResponse
    {
        $resource = new Resource();
        $resource->category_id = $request->categoryId;
        $resource->title = $request->title;
        $resource->url = $request->url;
        $resource->save();

        return redirect()->back()->with(['success' => 'Resource added']);
    }
}
