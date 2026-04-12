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
        $file = $request->file('uploaded_file');
        $originalName = $file->getClientOriginalName();
        $newName = Carbon::now()->timestamp . '-' . $originalName;
        switch ($request->upload_type) {
            case "fleet":
                $path = Storage::disk('s3')->putFileAs('fleet/bushdivers', $file, $newName);
                if ($path) {
                    $path = Storage::disk('s3')->url($path);
                    $entity = Fleet::find($request->entity_id);
                    $entity->image_url = $path;
                    $entity->save();
                } else {
                    redirect()->back()->with('error', 'File uploaded failed');
                }
                break;
            case "marketplace":
                $path = Storage::disk('s3')->putFileAs('fleet/marketplace', $file, $newName);
                if ($path) {
                    $path = Storage::disk('s3')->url($path);
                    $entity = Fleet::find($request->entity_id);
                    $entity->rental_image = $path;
                    $entity->save();
                } else {
                    redirect()->back()->with('error', 'File uploaded failed');
                }
                break;
            default:
                redirect()->back()->with('error', 'File uploaded failed');
                break;
        }
        // return
        redirect()->back()->with('success', 'File uploaded successfully');
    }
}
