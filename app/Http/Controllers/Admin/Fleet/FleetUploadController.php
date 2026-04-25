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
        $entity = Fleet::find($request->entity_id);

        if ($file) {
            $newName = Carbon::now()->timestamp . '-' . $file->getClientOriginalName();
        }

        switch ($request->upload_type) {
            case 'fleet':
                if ($file) {
                    $path = Storage::disk('s3')->putFileAs('fleet/bushdivers', $file, $newName);
                    if ($path) {
                        $entity->image_url = Storage::disk('s3')->url($path);
                    } else {
                        return redirect()->back()->with('error', 'File upload failed');
                    }
                }
                $entity->fleet_image_credit = $request->image_credit;
                $entity->save();
                break;
            case 'marketplace':
                if ($file) {
                    $path = Storage::disk('s3')->putFileAs('fleet/marketplace', $file, $newName);
                    if ($path) {
                        $entity->rental_image = Storage::disk('s3')->url($path);
                    } else {
                        return redirect()->back()->with('error', 'File upload failed');
                    }
                }
                $entity->rental_image_credit = $request->image_credit;
                $entity->save();
                break;
            default:
                return redirect()->back()->with('error', 'File upload failed');
        }

        return redirect()->back()->with('success', 'File uploaded successfully');
    }
}
