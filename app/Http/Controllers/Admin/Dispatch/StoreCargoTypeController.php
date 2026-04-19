<?php

namespace App\Http\Controllers\Admin\Dispatch;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCargoTypeRequest;
use App\Models\CargoType;
use Illuminate\Http\RedirectResponse;

class StoreCargoTypeController extends Controller
{
    public function __invoke(AdminCargoTypeRequest $request): RedirectResponse
    {
        CargoType::create($request->validated());

        return redirect()->route('admin.cargo-types')
            ->with('success', 'Cargo type created successfully.');
    }
}
