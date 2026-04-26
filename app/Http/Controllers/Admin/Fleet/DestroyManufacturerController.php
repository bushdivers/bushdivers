<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Manufacturer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyManufacturerController extends Controller
{
    public function __invoke(Request $request, Manufacturer $manufacturer): RedirectResponse
    {
        if ($manufacturer->fleet()->exists()) {
            return redirect()->route('admin.fleet')->with(['error' => 'Cannot delete a manufacturer that is in use by fleet types']);
        }

        $manufacturer->delete();

        return redirect()->route('admin.fleet')->with(['success' => 'Manufacturer deleted']);
    }
}
