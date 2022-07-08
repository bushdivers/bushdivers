<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        $file = $request->file('file');
        $filSize = $file->getSize();
        $fileName = $file->getClientOriginalName();
        // upload file
        $request->file('file')->storeAs('', $fileName, 's3');
        $res = Storage::disk('s3')->url($fileName);

        $resourse = Resource::find($request->id);

        if ($resourse) {
            $this->updateResource($request, $filSize, $res, $resourse);
        } else {
            $this->createResource($request, $filSize, $res);
        }

        return redirect()->back()->with(['success' => 'Resource created']);
    }

    protected function createResource($request, $size, $path)
    {
        $resource = new Resource();
        $resource->category_id = $request->categoryId;
        $resource->title = $request->title;
        $resource->url = $path;
        $resource->description = $request->desc;
        $resource->version = $request->version;
        $resource->filename = $request->package;
        $resource->author = $request->author;
        $resource->file_size = $size;
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

    protected function updateResource($request, $size, $path, $resource)
    {
        $resource->category_id = $request->categoryId;
        $resource->title = $request->title;
        $resource->url = $path;
        $resource->description = $request->desc;
        $resource->version = $request->version;
        $resource->filename = $request->package;
        $resource->author = $request->author;
        $resource->file_size = $size;
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
