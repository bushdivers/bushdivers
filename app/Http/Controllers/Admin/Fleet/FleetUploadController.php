<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUploadRequest;
use App\Models\Fleet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FleetUploadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(AdminUploadRequest $request)
    {
        $cloudFront = config('app.aws_cloudfront_url');
        $file = $request->file('uploaded_file');
        $originalName = $file->getClientOriginalName();
        $newName = Carbon::now()->timestamp . '-' . $originalName;
            switch ($request->upload_type) {
                case "fleet":
                    $path = Storage::disk('s3')->putFileAs('fleet/bushdivers', $file, $newName);
                    if ($path) {
                        $entity = Fleet::find($request->entity_id);
                        $entity->image_url = $cloudFront.'fleet/bushdivers/'.$newName;
                        $entity->save();
                    } else {
                        redirect()->back()->with('error', 'File uploaded failed');
                    }
                    break;
                case "marketplace":
                    $path = Storage::disk('s3')->putFileAs('fleet/marketplace', $file, $newName);
                    if ($path) {
                        $entity = Fleet::find($request->entity_id);
                        $entity->rental_image = $cloudFront.'fleet/marketplace/'.$newName;
                        $entity->save();
                    } else {
                        redirect()->back()->with('error', 'File uploaded failed');
                    }
                    break;
                case "livery":
                    $path = Storage::disk('s3')->putFileAs('liveries', $file, $newName);
                    if ($path) {
                        $entity = Fleet::find($request->entity_id);
                        $entity->uploads()->create([
                            'url' => $cloudFront . 'liveries/' . $newName,
                            'display_name' => $file->getClientOriginalName(),
                            'upload_type' => $request->upload_type,
                            'size' => $file->getSize()
                        ]);
                    } else {
                        redirect()->back()->with('error', 'File uploaded failed');
                    }
                    break;
            }
        // return
        redirect()->back()->with('success', 'File uploaded successfully');
    }
}
