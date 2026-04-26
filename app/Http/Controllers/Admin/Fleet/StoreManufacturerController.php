<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\ManufacturerRequest;
use App\Models\Manufacturer;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class StoreManufacturerController extends Controller
{
    public function __invoke(ManufacturerRequest $request): RedirectResponse
    {
        $logoUrl = '';

        if ($request->hasFile('uploaded_file')) {
            $file = $request->file('uploaded_file');
            $newName = Carbon::now()->timestamp . '-' . $file->getClientOriginalName();
            $path = Storage::disk('s3')->putFileAs('manufacturers/logos', $file, $newName);
            if ($path === false) {
                return redirect()->back()->with('error', 'Logo upload failed');
            }
            $logoUrl = Storage::disk('s3')->url($path);
        }

        Manufacturer::create([
            'name' => $request->name,
            'logo_url' => $logoUrl,
        ]);

        return redirect()->route('admin.fleet')->with(['success' => 'Manufacturer added']);
    }
}
