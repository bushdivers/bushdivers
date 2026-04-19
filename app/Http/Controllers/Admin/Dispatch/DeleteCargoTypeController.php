<?php

namespace App\Http\Controllers\Admin\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\CargoType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeleteCargoTypeController extends Controller
{
    public function __invoke(Request $request, int $id): RedirectResponse
    {
        $cargoType = CargoType::findOrFail($id);

        $cargoType->delete();

        return redirect()->route('admin.cargo-types')
            ->with('success', 'Cargo type deleted successfully.');
    }
}
