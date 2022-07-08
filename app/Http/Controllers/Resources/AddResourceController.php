<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddResourceController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        if ($request->type === 'new') {
            $this->createResource($request);
        } else {
            $this->updateResource($request);
        }

        return redirect()->to('/resources')->with(['success' => 'Resource created']);
    }

    protected function createResource($request)
    {
        $resource = new Resource();
        $resource->category_id = $request->data['categoryId'];
        $resource->title = $request->data['title'];
        $resource->url = $request->url;
        $resource->description = $request->data['desc'];
        $resource->version = $request->data['version'];
        $resource->filename = $request->data['package'];
        $resource->author = $request->data['author'];
        $resource->file_size = $request->size;
        $resource->user_id = Auth::user()->id;

        if ($request->dependencies) {
            $dep = [];
            foreach ($request->dependencies as $dependency) {
                $d = [
                    'filename' => $dependency['filename'],
                    'title' => $dependency['title'],
                    'mandatory' => $dependency['mandatory'],
                    'url' => $dependency['url']
                ];
                $dep[] = $d;
            }
            $resource->dependencies = $dep;
        }

        $resource->save();
    }

    protected function updateResource($request)
    {
        $resource = Resource::find($request->id);
        $resource->category_id = $request->data['categoryId'];
        $resource->title = $request->data['title'];
        $resource->url = $request->url;
        $resource->description = $request->data['desc'];
        $resource->version = $request->data['version'];
        $resource->filename = $request->data['package'];
        $resource->author = $request->data['author'];
        $resource->file_size = $request->size;
        $resource->user_id = Auth::user()->id;

        if ($request->dependencies) {
            $dep = [];
            foreach ($request->dependencies as $dependency) {
                $d = [
                    'filename' => $dependency['filename'],
                    'title' => $dependency['title'],
                    'mandatory' => $dependency['mandatory'],
                    'url' => $dependency['url']
                ];
                $dep[] = $d;
            }
            $resource->dependencies = $dep;
        }

        $resource->save();
    }
}
