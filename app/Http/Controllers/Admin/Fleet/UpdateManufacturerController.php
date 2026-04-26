<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\ManufacturerRequest;
use App\Models\Manufacturer;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class UpdateManufacturerController extends Controller
{
    public function __invoke(ManufacturerRequest $request, Manufacturer $manufacturer): RedirectResponse
    {
        $manufacturer->name = $request->name;

        if ($request->hasFile('uploaded_file')) {
            $file = $request->file('uploaded_file');
            $newName = Carbon::now()->timestamp . '-' . $file->getClientOriginalName();
            $path = Storage::disk('s3')->putFileAs('manufacturers/logos', $file, $newName);
            if ($path === false) {
                return redirect()->back()->with('error', 'Logo upload failed');
            }
            $manufacturer->logo_url = Storage::disk('s3')->url($path);
        }

        $manufacturer->save();

        return redirect()->route('admin.fleet')->with(['success' => 'Manufacturer updated']);
    }
}
