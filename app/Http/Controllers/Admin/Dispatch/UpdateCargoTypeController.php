<?php

namespace App\Http\Controllers\Admin\Dispatch;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCargoTypeRequest;
use App\Models\CargoType;
use Illuminate\Http\RedirectResponse;

class UpdateCargoTypeController extends Controller
{
    public function __invoke(AdminCargoTypeRequest $request, int $id): RedirectResponse
    {
        $cargoType = CargoType::findOrFail($id);
        $data = $request->validated();
        $cargoType->update([
            'text' => $data['text'],
            'min_cargo_split' => $data['min_cargo_split'],
        ]);

        return redirect()->route('admin.cargo-types')
            ->with('success', 'Cargo type updated successfully.');
    }
}
