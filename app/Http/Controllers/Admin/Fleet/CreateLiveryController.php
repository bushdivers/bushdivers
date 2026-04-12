<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateLiveryRequest;
use App\Models\Fleet;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class CreateLiveryController extends Controller
{
    public function __invoke(CreateLiveryRequest $request, int $id): RedirectResponse
    {
        $fleet = Fleet::findOrFail($id);

        $display = $request->display_name ?? null;
        if ($request->hasFile('uploaded_file')) {
            $file = $request->file('uploaded_file');
            $newName = Carbon::now()->timestamp . '-' . $file->getClientOriginalName();
            $url = Storage::disk('s3')->putFileAs('liveries', $file, $newName);
            if ($url === false) {
                return redirect()->back()->with('error', 'File upload failed');
            }

            if (empty($display)) {
                $display = $file->getClientOriginalName();
            }

            $url = Storage::disk('s3')->url($url);
            $disk = 's3';
            $size = $file->getSize();
        } else {
            $url = $request->url;
            $disk = null;
            $size = null;
        }

        $fleet->uploads()->create([
            'url' => $url,
            'display_name' => $display,
            'author' => $request->author,
            'sim_type' => $request->sim_type ?? [],
            'upload_type' => 'livery',
            'disk' => $disk,
            'size' => $size,
        ]);

        return redirect()->back()->with(['success' => 'Livery added']);
    }
}
