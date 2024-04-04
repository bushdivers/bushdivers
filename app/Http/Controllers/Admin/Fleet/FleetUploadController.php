<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUploadRequest;
use App\Models\Airport;
use App\Models\Fleet;
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
            switch ($request->upload_type) {
                case "fleet":
                    $path = Storage::disk('s3')->putFileAs('fleet/bushdivers', $file, $file->getClientOriginalName());
                    if ($path) {
                        $entity = Fleet::find($request->entity_id);
                        $entity->image_url = $cloudFront.'fleet/bushdivers/'.$file->getClientOriginalName();
                        $entity->save();
                    } else {
                        redirect()->back()->with('error', 'File uploaded failed');
                    }
                    break;
                case "marketplace":
                    $path = Storage::disk('s3')->putFileAs('fleet/marketplace', $file, $file->getClientOriginalName());
                    if ($path) {
                        $entity = Fleet::find($request->entity_id);
                        $entity->rental_image = $cloudFront.'fleet/marketplace/'.$file->getClientOriginalName();
                        $entity->save();
                    } else {
                        redirect()->back()->with('error', 'File uploaded failed');
                    }
                    break;
                case "livery":
                    $path = Storage::disk('s3')->putFileAs('liveries', $file, $file->getClientOriginalName());
                    if ($path) {
                        $entity = Fleet::find($request->entity_id);
                        $entity->uploads()->create([
                            'url' => $cloudFront . 'liveries/' . $file->getClientOriginalName(),
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
